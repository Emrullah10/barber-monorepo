import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';
import { queryKeys } from '@/shared/constant/query-keys';

export default function useCreateAppointment() {
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ servicesId, appointmentDate, appointmentTime, barberId, tenantId }) =>
      api.post('/appointments', { servicesId, appointmentDate, appointmentTime, barberId, tenantId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.my });
    },
  });

  const createAppointment = async (payload) => {
    setError(null);
    try {
      await mutation.mutateAsync(payload);
      return true;
    } catch (err) {
      if (err.response?.status === 404 || err.response?.status === 501) {
        setError('Randevu sistemi yakında aktif olacak.');
      } else {
        setError(err.response?.data?.message ?? 'Randevu oluşturulamadı.');
      }
      return false;
    }
  };

  return {
    createAppointment,
    isLoading: mutation.isPending,
    error,
    success: mutation.isSuccess,
  };
}
