const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Order = require("../module/order");
const axios = require("axios");

// Helper to generate eSewa signature
const generateEsewaSignature = (secretKey, message) => {
  const hmac = crypto.createHmac("sha256", secretKey);
  hmac.update(message);
  return hmac.digest("base64");
};

// Initiate payment (returns config for eSewa/Khalti)
router.post("/initiate", async (req, res) => {
  try {
    const { orderId, method } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const amount = order.totalAmount;
    const transactionUuid = `${orderId}-${Date.now()}`;

    if (method === "esewa") {
      const esewaConfig = {
        amount: amount,
        tax_amount: "0",
        total_amount: amount,
        transaction_uuid: transactionUuid,
        product_code: process.env.ESEWA_PRODUCT_CODE || "EPAYTEST",
        product_service_charge: "0",
        product_delivery_charge: "0",
        success_url: `${process.env.CLIENT_URL}/payment-success?method=esewa&orderId=${orderId}`,
        failure_url: `${process.env.CLIENT_URL}/payment-failed?method=esewa&orderId=${orderId}`,
        signed_field_names: "total_amount,transaction_uuid,product_code",
      };

      const signatureString = `total_amount=${esewaConfig.total_amount},transaction_uuid=${esewaConfig.transaction_uuid},product_code=${esewaConfig.product_code}`;
      const signature = generateEsewaSignature(
        process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q",
        signatureString
      );

      return res.json({
        method: "esewa",
        url: process.env.ESEWA_URL || "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
        config: { ...esewaConfig, signature },
      });
    } else if (method === "khalti") {
      const khaltiConfig = {
        return_url: `${process.env.CLIENT_URL}/payment-success?method=khalti&orderId=${orderId}`,
        website_url: process.env.CLIENT_URL,
        amount: Math.round(amount * 100), // Khalti expects paisa
        purchase_order_id: orderId,
        purchase_order_name: `Order #${orderId}`,
      };

      try {
        const response = await axios.post(
          process.env.KHALTI_URL || "https://a.khalti.com/api/v2/epayment/initiate/",
          khaltiConfig,
          {
            headers: {
              Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data && response.data.payment_url) {
          return res.json({
            method: "khalti",
            url: response.data.payment_url,
            pidx: response.data.pidx,
          });
        }
        throw new Error("Failed to initiate Khalti payment");
      } catch (err) {
        console.error("Khalti Error:", err.response?.data || err.message);
        return res.status(500).json({ error: "Khalti initiation failed" });
      }
    }

    res.status(400).json({ error: "Invalid payment method" });
  } catch (error) {
    console.error("Payment Initiation Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Verify payment
router.get("/verify", async (req, res) => {
  try {
    const { method, orderId, data, pidx } = req.query;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (method === "esewa" && data) {
      // Decode eSewa data
      const decoded = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
      
      if (decoded.status !== "COMPLETE") {
        return res.status(400).json({ error: "Payment not completed" });
      }

      // Verify with eSewa server
      const verifyUrl = `${process.env.ESEWA_VERIFY_URL || "https://rc-epay.esewa.com.np/api/epay/transaction/status/"}?product_code=${process.env.ESEWA_PRODUCT_CODE || "EPAYTEST"}&total_amount=${decoded.total_amount}&transaction_uuid=${decoded.transaction_uuid}`;
      
      const verifyRes = await axios.get(verifyUrl);
      
      if (verifyRes.data.status === "COMPLETE" && Number(verifyRes.data.total_amount) === order.totalAmount) {
        order.paymentStatus = "Completed";
        order.transactionId = decoded.transaction_uuid;
        order.paymentDetails = decoded;
        await order.save();
        return res.json({ message: "Payment verified successfully", order });
      }
    } else if (method === "khalti" && pidx) {
      const verifyUrl = process.env.KHALTI_VERIFY_URL || "https://a.khalti.com/api/v2/epayment/lookup/";
      
      const response = await axios.post(
        verifyUrl,
        { pidx },
        {
          headers: {
            Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "Completed" && (response.data.total_amount / 100) === order.totalAmount) {
        order.paymentStatus = "Completed";
        order.transactionId = pidx;
        order.paymentDetails = response.data;
        await order.save();
        return res.json({ message: "Payment verified successfully", order });
      }
    }

    res.status(400).json({ error: "Payment verification failed" });
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
