"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import {
  Bell,
  ChevronLeft,
  Trash2,
  Clock,
  ShoppingBag,
  Tag,
  Info,
  CheckCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { notificationApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface Notification {
  _id: string;
  notificationTitle: string;
  notificationDescription: string;
  notificationImage?: string;
  type: "order" | "promo" | "info";
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch Notifications
  const fetchNotifications = async () => {
    try {
      const res = await notificationApi.getAll(user?.id);
      setNotifications(res.data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user?.id]);

  // 🔥 Mark Single as Read
  const markAsRead = async (id: string) => {
    try {
      if (!user?.id) return;
      await notificationApi.update(id, { isRead: true, userId: user.id });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
    } catch (error) {
      console.error("Mark as read failed", error);
    }
  };

  // 🔥 Mark All as Read
  const markAllRead = async () => {
    try {
      if (!user?.id) return;
      await Promise.all(
        notifications.map((n) =>
          notificationApi.update(n._id, { isRead: true, userId: user.id }),
        ),
      );
      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  // 🔥 Delete Single
  const handleDelete = async (id: string) => {
    try {
      await notificationApi.delete(id, user?.id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // 🔥 Delete All
  const deleteAll = async () => {
    try {
      await notificationApi.deleteAll(user?.id);
      setNotifications([]);
    } catch (error) {
      console.error(error);
    }
  };

  const getIcon = (type: string) => {
    if (type === "order") return ShoppingBag;
    if (type === "promo") return Tag;
    return Info;
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4">
          {/* Header */}
          <div className="flex justify-between mb-10">
            <div>
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-400 hover:text-[#EE4444] font-bold mb-4"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>

              <h1 className="text-4xl font-black text-[#2D2D2D]">
                Notifications
              </h1>
            </div>

            <div className="flex gap-3">
              <button
                onClick={markAllRead}
                className="h-12 px-5 rounded-xl bg-white border text-xs font-bold flex items-center gap-2"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all read
              </button>

              <button
                onClick={deleteAll}
                className="h-12 w-12 rounded-xl bg-white border text-gray-400 hover:text-red-500 flex items-center justify-center"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Notifications Box */}
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-10 text-center text-gray-400">Loading...</div>
            ) : notifications.length > 0 ? (
              notifications.map((notif) => {
                const Icon = getIcon(notif.type);

                return (
                  <div
                    key={notif._id}
                    onClick={() => markAsRead(notif._id)}
                    className={`p-6 flex items-start gap-6 border-b hover:bg-gray-50 cursor-pointer ${
                      !notif.isRead ? "bg-red-50/20" : ""
                    }`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                      {notif.notificationImage ? (
                        <img src={notif.notificationImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-bold">
                          {notif.notificationTitle}
                        </h3>

                        {!notif.isRead && (
                          <div className="w-2 h-2 bg-red-500 rounded-full" />
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mt-1 mb-2">
                        {notif.notificationDescription}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {new Date(notif.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notif._id);
                      }}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="py-20 flex flex-col items-center text-center">
                <Bell className="w-10 h-10 text-gray-300 mb-4" />
                <h3 className="text-xl font-bold">No notifications yet</h3>
                <p className="text-gray-400">
                  We'll notify you when something happens.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
