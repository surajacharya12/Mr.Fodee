"use client";

import React, { useEffect, useState } from "react";
import {
  Package,
  Search,
  Filter,
  MapPin,
  Clock,
  User,
  Phone,
  CheckCircle2,
  Bike,
  PackageCheck,
  XCircle,
  ChevronRight,
  MoreVertical,
  ArrowUpRight,
  Banknote,
  Wallet,
  CreditCard,
  X,
  ExternalLink
} from "lucide-react";
import { orderApi } from "@/lib/api";
import toast from "react-hot-toast";

interface Order {
  _id: string;
  user: {
    username: string;
    email: string;
    phoneNumber: string;
  };
  items: Array<{
    food: {
      name: string;
      price: number;
    };
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  deliveryAddress: string;
  paymentMethod: string;
  status: string;
  paymentStatus: string;
  instructions?: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  Pending: "bg-orange-50 text-orange-600 border-orange-100",
  Confirmed: "bg-blue-50 text-blue-600 border-blue-100",
  Preparing: "bg-purple-50 text-purple-600 border-purple-100",
  "Out for Delivery": "bg-indigo-50 text-indigo-600 border-indigo-100",
  Delivered: "bg-emerald-50 text-emerald-600 border-emerald-100",
  Cancelled: "bg-red-50 text-red-600 border-red-100",
};

const statusIcons: Record<string, any> = {
  Pending: Clock,
  Confirmed: CheckCircle2,
  Preparing: Package,
  "Out for Delivery": Bike,
  Delivered: PackageCheck,
  Cancelled: XCircle,
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedMapUrl, setSelectedMapUrl] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderApi.getAll();
      setOrders(res.data);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, updates: { status?: string; paymentStatus?: string }) => {
    try {
      await orderApi.updateStatus(orderId, updates);
      toast.success(`Order updated successfully`);
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update order");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Manage Orders</h1>
          <p className="text-gray-500 font-bold">
            Monitor and update active orders
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#EE4444] transition-colors" />
          <input
            type="text"
            placeholder="Search by Order ID or Username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white border border-gray-100 shadow-sm focus:ring-2 focus:ring-[#EE4444]/10 focus:border-[#EE4444] outline-none transition-all font-bold text-sm"
          />
        </div>
        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto scrollbar-hide">
          {[
            "All",
            "Pending",
            "Confirmed",
            "Preparing",
            "Out for Delivery",
            "Delivered",
            "Cancelled",
          ].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                statusFilter === status
                  ? "bg-[#EE4444] text-white shadow-lg shadow-red-500/20"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid/Table */}
      <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  Order & User
                </th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  Items & Total
                </th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  Payment
                </th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  Address
                </th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  Status
                </th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-[#EE4444] border-t-transparent rounded-full animate-spin" />
                      <span className="text-gray-400 font-bold">
                        Loading orders...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const StatusIcon = statusIcons[order.status] || Clock;
                  return (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-black text-[#2D2D2D] text-sm group-hover:text-[#EE4444] transition-colors mb-1 uppercase tracking-tighter">
                            {order._id.slice(-8).toUpperCase()}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-gray-500 font-bold">
                            <span className="bg-gray-100 p-1 rounded-md">
                              <User className="w-3 h-3" />
                            </span>
                            {order.user?.username || "Unknown User"}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold mt-1">
                            <Phone className="w-3 h-3" />
                            {order.user?.phoneNumber || "No Phone"}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-[#2D2D2D] mb-1">
                            Rs. {order.totalAmount}
                          </span>
                          <span className="text-xs text-gray-400 font-bold line-clamp-1">
                            {order.items
                              .map(
                                (item) =>
                                  `${item.quantity}x ${item.food?.name}`,
                              )
                              .join(", ")}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit ${
                              order.paymentMethod === "COD"
                                ? "bg-orange-50 text-orange-600"
                                : order.paymentMethod === "Card"
                                  ? "bg-blue-50 text-blue-600"
                                  : "bg-emerald-50 text-emerald-600"
                            }`}
                          >
                            {order.paymentMethod === "COD" && (
                              <Banknote className="w-3 h-3" />
                            )}
                            {order.paymentMethod === "Card" && (
                              <CreditCard className="w-3 h-3" />
                            )}
                            {order.paymentMethod === "Wallet" && (
                              <Wallet className="w-3 h-3" />
                            )}
                            {order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}
                          </span>
                          
                          {/* Payment status toggle */}
                          <button
                            onClick={() => handleStatusUpdate(order._id, { 
                              paymentStatus: order.paymentStatus === 'Paid' ? 'Pending' : 'Paid' 
                            })}
                            className={`mt-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all ${
                              order.paymentStatus === 'Paid' 
                                ? 'bg-emerald-500 text-white border-emerald-500' 
                                : 'bg-white text-gray-400 border-gray-100 hover:border-orange-200 hover:text-orange-500'
                            }`}
                          >
                            {order.paymentStatus === 'Paid' ? 'Mark as Unpaid' : 'Mark as Paid'}
                          </button>
                        </div>
                      </td>
                      <td className="px-8 py-6 max-w-xs">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                          {order.deliveryAddress.startsWith("http") ? (
                            <button
                              onClick={() => setSelectedMapUrl(order.deliveryAddress)}
                              className="text-xs text-[#EE4444] font-black leading-relaxed line-clamp-2 hover:underline flex items-center gap-1 group/map"
                            >
                              View on Map
                              <ArrowUpRight className="w-3 h-3 group-hover/map:translate-x-0.5 group-hover/map:-translate-y-0.5 transition-transform" />
                            </button>
                          ) : (
                            <button
                              onClick={() => setSelectedMapUrl(`https://www.google.com/maps?q=${encodeURIComponent(order.deliveryAddress)}`)}
                              className="text-xs text-gray-500 font-bold leading-relaxed line-clamp-2 hover:text-[#EE4444] transition-colors text-left"
                            >
                              {order.deliveryAddress}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColors[order.status]}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="relative inline-block text-left group/dropdown">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusUpdate(order._id, { status: e.target.value })
                            }
                            className="bg-gray-50 border border-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2 hover:border-[#EE4444] outline-none transition-all cursor-pointer appearance-none pr-8"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Out for Delivery">
                              Out for Delivery
                            </option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          <ChevronRight className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none transition-colors group-hover/dropdown:text-[#EE4444]" />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                        <Package className="w-8 h-8" />
                      </div>
                      <span className="text-gray-400 font-bold">
                        No orders found matching your criteria.
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Map Modal */}
      {selectedMapUrl && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-[#2D2D2D]/80 backdrop-blur-md animate-in fade-in duration-300" 
            onClick={() => setSelectedMapUrl(null)}
          />
          <div className="relative bg-white rounded-[3rem] w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#EE4444] flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#2D2D2D]">Delivery Location</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                      Precise GPS Tracking Active
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a 
                  href={selectedMapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-50 text-gray-600 font-black text-xs hover:bg-gray-100 transition-all border border-gray-100 uppercase tracking-widest"
                >
                  Open in Google Maps
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button 
                  onClick={() => setSelectedMapUrl(null)}
                  className="w-12 h-12 rounded-xl bg-gray-50 text-gray-400 hover:text-gray-900 flex items-center justify-center transition-all group"
                >
                  <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 bg-gray-100 relative">
              <iframe
                src={`https://maps.google.com/maps?q=${selectedMapUrl.includes('q=') ? selectedMapUrl.split('q=')[1] : encodeURIComponent(selectedMapUrl)}&z=15&output=embed`}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
