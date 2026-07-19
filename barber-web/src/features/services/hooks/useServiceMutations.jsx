import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';

export function useServiceMutations() {
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (fn) => fn(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });

  const run = async (fn) => {
    setError(null);
    try {
      const { data } = await mutation.mutateAsync(fn);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Bir hata oluştu.';
      setError(msg);
      throw err;
    }
  };

  const createService = (body) => run(() => api.post('/services', body));
  const updateService = (id, body) => run(() => api.put(`/services/${id}`, body));
  const deleteService = (id) => run(() => api.delete(`/services/${id}`));

  return {
    createService,
    updateService,
    deleteService,
    isLoading: mutation.isPending,
    error,
    clearError: () => setError(null),
  };
}
