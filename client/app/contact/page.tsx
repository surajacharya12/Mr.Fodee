"use client";

import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-4">
          
          <div className="flex flex-col lg:flex-row gap-16 py-12">
            
            {/* Contact Info */}
            <div className="lg:w-1/3">
              <h1 className="text-4xl md:text-5xl font-black text-[#2D2D2D] mb-6">Get in Touch</h1>
              <p className="text-gray-500 text-lg mb-10 leading-relaxed">
                Have a question, feedback, or need help with an order? Our team is here for you 24/7.
              </p>

              <div className="space-y-8">
                {[
                  { icon: Phone, title: "Phone", info: "+977 1-2345678", desc: "Mon-Sun, 9am - 10pm" },
                  { icon: Mail, title: "Email", info: "hello@mrfodee.com", desc: "Expect response within 2h" },
                  { icon: MapPin, title: "Headquarters", info: "123 Foodie Street, Kathmandu", desc: "Visit our vibrant office" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 text-[#EE4444] flex items-center justify-center shrink-0 group-hover:bg-[#EE4444] group-hover:text-white transition-all duration-300">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#2D2D2D] text-lg">{item.title}</h3>
                      <p className="text-[#EE4444] font-bold mb-1">{item.info}</p>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:w-2/3">
              <div className="bg-gray-50 rounded-[3rem] p-8 md:p-12 border border-gray-100">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-2">Full Name</label>
                      <input 
                        type="text" 
                        placeholder="John Doe"
                        className="w-full h-14 px-6 rounded-2xl bg-white border border-gray-200 outline-none focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/5 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-2">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="john@example.com"
                        className="w-full h-14 px-6 rounded-2xl bg-white border border-gray-200 outline-none focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/5 transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-2">Subject</label>
                    <select className="w-full h-14 px-6 rounded-2xl bg-white border border-gray-200 outline-none focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/5 transition-all appearance-none cursor-pointer">
                      <option>Order Assistance</option>
                      <option>Partnership Inquiry</option>
                      <option>Delivery Feedback</option>
                      <option>General Question</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-2">Your Message</label>
                    <textarea 
                      rows={5}
                      placeholder="Tell us what's on your mind..."
                      className="w-full p-6 rounded-3xl bg-white border border-gray-200 outline-none focus:border-[#EE4444] focus:ring-4 focus:ring-[#EE4444]/5 transition-all resize-none"
                    ></textarea>
                  </div>

                  <button className="h-16 w-full md:w-auto px-12 rounded-full bg-[#EE4444] text-white font-bold flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#EE4444]/25">
                    <Send className="w-5 h-5" />
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="py-24">
            <h2 className="text-3xl font-black text-[#2D2D2D] text-center mb-12">Frequent Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { q: "How do I track my order?", a: "Once your order is picked up, you can track the real-time location of the rider through the 'My Orders' section in the app." },
                { q: "What is the average delivery time?", a: "We aim to deliver within 30-45 minutes. However, this depends on the distance and restaurant preparation time." },
                { q: "Can I cancel my order?", a: "Orders can only be canceled within 1 minute of being placed. After that, the restaurant starts preparing your food." },
                { q: "What should I do if my food is damaged?", a: "Please reach out to our support through the 'Help' section immediately. We'll arrange a refund or replacement." }
              ].map((faq, i) => (
                <div key={i} className="p-8 rounded-[2rem] bg-white border border-gray-100 hover:border-[#EE4444]/30 transition-all">
                  <h3 className="font-bold text-[#2D2D2D] text-lg mb-3 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#EE4444]" />
                    {faq.q}
                  </h3>
                  <p className="text-gray-500 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
