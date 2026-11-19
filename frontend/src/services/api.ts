import axios from 'axios';
import { Product, TryOnJob } from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 180000,
});

export const productsApi = {
  getAll: (params?: Record<string, string | number | boolean>) =>
    api.get<Product[]>('/products', { params }).then(r => r.data),
  getById: (id: string) =>
    api.get<Product>(`/products/${id}`).then(r => r.data),
};

export const tryonApi = {
  start: (productId: string, imageFile: File): Promise<TryOnJob> => {
    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('image', imageFile);
    return api.post<{ success: boolean; jobId: string; status: TryOnJob['status'] }>(
      '/virtual-try-on', formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    ).then(r => ({
      jobId: r.data.jobId,
      productId,
      status: r.data.status,
    }));
  },
  getStatus: (jobId: string): Promise<TryOnJob> =>
    api.get<TryOnJob>(`/virtual-try-on/${jobId}`).then(r => r.data),
};
