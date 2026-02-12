import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';



const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userApi = {
  create: (userData: any) => api.post('/user/users', userData),
  login: (credentials: any) => api.post('/user/login', credentials),
  getById: (id: string) => api.get(`/user/users/${id}`),
  update: (id: string, userData: any) => api.put(`/user/users/${id}`, userData),
  delete: (id: string) => api.delete(`/user/users/${id}`),
  addAddress: (id: string, address: { type: string; detail: string; isDefault: boolean }) => api.post(`/user/users/${id}/addresses`, address),
  deleteAddress: (userId: string, addressId: string) => api.delete(`/user/users/${userId}/addresses/${addressId}`),
  updateAddress: (userId: string, addressId: string, address: { type?: string; detail?: string; isDefault?: boolean }) => api.put(`/user/users/${userId}/addresses/${addressId}`, address),
  updatePassword: (id: string, passwords: any) => api.put(`/user/users/${id}/password`, passwords),
  getAll: () => api.get('/user/users'),
};



export const restaurantApi = {
  getAll: (params?: { category?: string }) => api.get('/restaurant', { params }),
  getById: (id: string) => api.get(`/restaurant/${id}`),
  create: (data: any) => api.post('/restaurant', data),
  update: (id: string, data: any) => api.put(`/restaurant/${id}`, data),
  delete: (id: string) => api.delete(`/restaurant/${id}`),
};

export const offerApi = {
  getAll: () => api.get('/offer'), // Active offers
  getAllAdmin: () => api.get('/offer/all'), // All offers for admin
  getById: (id: string) => api.get(`/offer/${id}`),
  create: (data: any) => api.post('/offer', data),
  update: (id: string, data: any) => api.put(`/offer/${id}`, data),
  delete: (id: string) => api.delete(`/offer/${id}`),
};

export const uploadApi = {
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export const foodApi = {
  getAll: (params?: { restaurant?: string, category?: string }) => api.get('/food', { params }),
  getById: (id: string) => api.get(`/food/${id}`),
};

export const favoritesApi = {
  toggle: (data: { user: string; food: string }) => api.post('/favorites/toggle', data),
  getAllByUser: (userId: string) => api.get(`/favorites/${userId}`),
};

export const categoryApi = {
  getAll: () => api.get('/category'),
  getById: (id: string) => api.get(`/category/${id}`),
};

export const reviewApi = {
  create: (data: { user: string; restaurant?: string; food?: string; rating: number; comment?: string }) => api.post('/review', data),
  getForRestaurant: (id: string) => api.get(`/review/restaurant/${id}`),
  getForFood: (id: string) => api.get(`/review/food/${id}`),
};

export default api;
