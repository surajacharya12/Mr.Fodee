import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(
      `🌐 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
    );
    if (config.data) {
      console.log("Request data:", config.data);
    }
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(
      `❌ API Error: ${error.response?.status} ${error.config?.url}`,
    );
    console.error("Error details:", error.response?.data);
    return Promise.reject(error);
  },
);

export const userApi = {
  create: (userData: any) => api.post("/user/users", userData),
  login: (credentials: any) => api.post("/user/login", credentials),
  getById: (id: string) => api.get(`/user/users/${id}`),
  update: (id: string, userData: any) => api.put(`/user/users/${id}`, userData),
  delete: (id: string) => api.delete(`/user/users/${id}`),
  addAddress: (
    id: string,
    address: { type: string; detail: string; isDefault: boolean },
  ) => api.post(`/user/users/${id}/addresses`, address),
  deleteAddress: (userId: string, addressId: string) =>
    api.delete(`/user/users/${userId}/addresses/${addressId}`),
  updateAddress: (
    userId: string,
    addressId: string,
    address: { type?: string; detail?: string; isDefault?: boolean },
  ) => api.put(`/user/users/${userId}/addresses/${addressId}`, address),
  updatePassword: (id: string, passwords: any) =>
    api.put(`/user/users/${id}/password`, passwords),
  getAll: () => api.get("/user/users"),
};

export const restaurantApi = {
  getAll: (params?: { category?: string }) =>
    api.get("/restaurant", { params }),
  getById: (id: string) => api.get(`/restaurant/${id}`),
  create: (data: any) => api.post("/restaurant", data),
  update: (id: string, data: any) => api.put(`/restaurant/${id}`, data),
  delete: (id: string) => api.delete(`/restaurant/${id}`),
};

export const offerApi = {
  getAll: () => api.get("/offer"), // Active offers
  getAllAdmin: () => api.get("/offer/all"), // All offers for admin
  getById: (id: string) => api.get(`/offer/${id}`),
  create: (data: any) => api.post("/offer", data),
  update: (id: string, data: any) => api.put(`/offer/${id}`, data),
  delete: (id: string) => api.delete(`/offer/${id}`),
};

export const uploadApi = {
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export const foodApi = {
  getAll: (params?: { restaurant?: string; category?: string }) =>
    api.get("/food", { params }),
  getById: (id: string) => api.get(`/food/${id}`),
};

export const favoritesApi = {
  toggle: (data: { user: string; food: string }) =>
    api.post("/favorites/toggle", data),
  getAllByUser: (userId: string) => api.get(`/favorites/${userId}`),
};

export const categoryApi = {
  getAll: () => api.get("/category"),
  getById: (id: string) => api.get(`/category/${id}`),
};

export const reviewApi = {
  create: (data: {
    user: string;
    restaurant?: string;
    food?: string;
    rating: number;
    comment?: string;
  }) => api.post("/review", data),
  getForRestaurant: (id: string) => api.get(`/review/restaurant/${id}`),
  getForFood: (id: string) => api.get(`/review/food/${id}`),
};

export const notificationApi = {
  getAll: (userId?: string) => api.get("/notification/all", { params: { userId } }),
  getById: (id: string, userId?: string) => api.get(`/notification/${id}`, { params: { userId } }),
  create: (data: any) => api.post("/notification", data),
  update: (id: string, data: any) => api.put(`/notification/${id}`, data),
  delete: (id: string, userId?: string) => api.delete(`/notification/${id}`, { params: { userId } }),
  deleteAll: (userId?: string) => api.delete("/notification", { params: { userId } }),
};

export const cartApi = {
  getByUser: (userId: string) => api.get(`/cart/${userId}`),
  addItem: (data: { userId: string; foodId: string; quantity: number; restaurantId: string }) => api.post("/cart/add", data),
  updateQuantity: (data: { userId: string; foodId: string; quantity: number }) => api.put("/cart/update", data),
  removeItem: (userId: string, foodId: string) => api.delete(`/cart/remove/${userId}/${foodId}`),
  clear: (userId: string) => api.delete(`/cart/clear/${userId}`),
};

export const orderApi = {
  placeCOD: (data: { 
    userId: string; 
    items: any[]; 
    totalAmount: number; 
    deliveryAddress: string; 
    instructions?: string 
  }) => api.post("/order/cod", data),
  placeOrder: (data: {
    userId: string;
    items: any[];
    totalAmount: number;
    deliveryAddress: string;
    paymentMethod: string;
    instructions?: string;
  }) => api.post("/order/create", data),
  getUserOrders: (userId: string) => api.get(`/order/user/${userId}`),
};

export const paymentApi = {
  initiate: (data: { orderId: string; method: string }) =>
    api.post("/payment/initiate", data),
  verify: (params: {
    method: string;
    orderId: string;
    data?: string;
    pidx?: string;
  }) => api.get("/payment/verify", { params }),
};

export default api;
