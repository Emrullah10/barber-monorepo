import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';
import { queryKeys } from '@/shared/constant/query-keys';

export default function useAppointments() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.appointments.my,
    queryFn: async () => {
      try {
        const response = await api.get('/appointments/my');
        return response.data?.list ?? [];
      } catch (err) {
        // API henüz aktif değilse veya yetkisizse sessizce boş liste döndür
        if ([404, 501, 401].includes(err.response?.status)) {
          return [];
        }
        throw err;
      }
    },
  });

  return {
    appointments: data ?? [],
    isLoading,
    error: error ? (error.response?.data?.message ?? 'Randevular yüklenemedi.') : null,
    refetch,
  };
}
