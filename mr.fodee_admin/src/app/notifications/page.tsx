"use client";

import React, { useEffect, useState } from "react";
import { notificationApi, uploadApi } from "@/lib/api";
import { 
  Search, 
  Trash2, 
  Bell, 
  Plus, 
  Edit2, 
  X,
  Info,
  Tag as TagIcon,
  ShoppingBag,
  Upload,
  Loader
} from "lucide-react";
import toast from "react-hot-toast";

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    notificationTitle: "",
    notificationDescription: "",
    notificationImage: "",
    type: "info" as "order" | "promo" | "info",
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await notificationApi.getAll();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = notifications.filter(n => 
    n.notificationTitle?.toLowerCase().includes(search.toLowerCase()) || 
    n.notificationDescription?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return;
    try {
      await notificationApi.delete(id);
      setNotifications(notifications.filter(n => n._id !== id));
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Failed to delete:", error);
      toast.error("Failed to delete notification");
    }
  };

  const handleEdit = (notif: Notification) => {
    setEditingId(notif._id);
    setFormData({
      notificationTitle: notif.notificationTitle,
      notificationDescription: notif.notificationDescription,
      notificationImage: notif.notificationImage || "",
      type: notif.type,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { data } = await notificationApi.update(editingId, formData);
        setNotifications(notifications.map(n => n._id === editingId ? data : n));
        toast.success("Notification updated");
      } else {
        const { data } = await notificationApi.create(formData);
        setNotifications([data, ...notifications]);
        toast.success("Notification created");
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save:", error);
      toast.error("Failed to save notification");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const toastId = toast.loading("Uploading image...");
    try {
      const response = await uploadApi.uploadFile(file);
      setFormData(prev => ({ ...prev, notificationImage: response.data.url }));
      toast.success("Image uploaded", { id: toastId });
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Upload failed", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      notificationTitle: "",
      notificationDescription: "",
      notificationImage: "",
      type: "info",
    });
    setEditingId(null);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "order": return <ShoppingBag className="w-4 h-4" />;
      case "promo": return <TagIcon className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "order": return "bg-blue-50 text-blue-600";
      case "promo": return "bg-orange-50 text-orange-600";
      default: return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-800">Notifications</h1>
          <p className="text-gray-500 font-medium">Create and manage alerts for your users.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search alerts..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-64 h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#EE4444]/20 focus:border-[#EE4444] transition-all"
            />
          </div>
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="h-12 px-6 bg-[#EE4444] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-[#D33333] transition-all shadow-lg shadow-red-500/20"
          >
            <Plus className="w-5 h-5" />
            New Alert
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Notification</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">Loading alerts...</td>
                </tr>
              ) : filteredNotifications.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">No notifications found.</td>
                </tr>
              ) : (
                filteredNotifications.map((notif) => (
                  <tr key={notif._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4 max-w-md">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                          {notif.notificationImage ? (
                            <img src={notif.notificationImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Bell className="w-6 h-6 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{notif.notificationTitle}</p>
                          <p className="text-sm text-gray-400 line-clamp-1">{notif.notificationDescription}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1 capitalize ${getTypeStyle(notif.type)}`}>
                        {getTypeIcon(notif.type)}
                        {notif.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(notif)}
                          className="p-2 text-gray-400 hover:text-[#EE4444] hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(notif._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 h-[90vh] flex flex-col">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-gray-800">
                  {editingId ? "Edit Notification" : "New Notification"}
                </h2>
                <p className="text-gray-500 font-medium text-sm">Fill in the details for the user alert.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-1">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Notification Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {(["info", "promo", "order"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: t })}
                      className={`py-3 rounded-xl border-2 font-black text-xs transition-all capitalize flex flex-col items-center gap-2 ${
                        formData.type === t 
                        ? "border-[#EE4444] bg-red-50 text-[#EE4444]" 
                        : "border-gray-100 hover:border-gray-200 text-gray-400"
                      }`}
                    >
                      {getTypeIcon(t)}
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Alert Heading</label>
                <input 
                  type="text" 
                  required
                  value={formData.notificationTitle}
                  onChange={(e) => setFormData({ ...formData, notificationTitle: e.target.value })}
                  placeholder="e.g. Order Delivered!"
                  className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#EE4444]/20 focus:border-[#EE4444] focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Alert Image (Optional)</label>
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="notification-image-upload"
                  />
                  <label 
                    htmlFor="notification-image-upload"
                    className="w-full h-32 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#EE4444] hover:bg-red-50 transition-all group overflow-hidden"
                  >
                    {formData.notificationImage ? (
                      <img src={formData.notificationImage} alt="Preview" className="h-full w-full object-cover" />
                    ) : uploading ? (
                      <Loader className="w-8 h-8 text-[#EE4444] animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-200 group-hover:text-[#EE4444] transition-colors mb-2" />
                        <span className="text-xs font-black text-gray-400 group-hover:text-[#EE4444] uppercase tracking-wider">Upload Alert Image</span>
                      </>
                    )}
                  </label>
                  {formData.notificationImage && (
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, notificationImage: "" }))}
                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg text-red-500 hover:scale-110 transition-transform"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Detailed Message</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.notificationDescription}
                  onChange={(e) => setFormData({ ...formData, notificationDescription: e.target.value })}
                  placeholder="Tell the user more about this alert..."
                  className="w-full p-4 bg-gray-50 border border-transparent rounded-xl font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#EE4444]/20 focus:border-[#EE4444] focus:bg-white transition-all resize-none"
                />
              </div>

              <div className="pt-2 flex gap-3 sticky bottom-0 bg-white">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-12 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={uploading}
                  className="flex-1 h-12 rounded-xl font-black text-white bg-[#EE4444] hover:bg-[#D33333] transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
                >
                  {editingId ? "Save Changes" : "Create Notification"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
