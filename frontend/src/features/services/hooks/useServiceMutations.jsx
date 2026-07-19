import { useState } from 'react';
import api from '@/api/axios';

export function useServiceMutations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = async (fn) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await fn();
      return data;
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Bir hata oluştu.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createService = (body) => run(() => api.post('/services', body));
  const updateService = (id, body) => run(() => api.put(`/services/${id}`, body));
  const deleteService = (id) => run(() => api.delete(`/services/${id}`));

  return { createService, updateService, deleteService, isLoading, error, clearError: () => setError(null) };
}
