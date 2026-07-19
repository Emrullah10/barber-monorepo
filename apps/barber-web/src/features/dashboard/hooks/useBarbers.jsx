import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';
import { queryKeys } from '@/shared/constant/query-keys';

export default function useBarbers() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.barbers.all,
    queryFn: async () => {
      const response = await api.get('/barbers');
      return response.data?.list ?? [];
    },
  });

  return {
    barbers: data ?? [],
    isLoading,
    error: error ? (error.response?.data?.message ?? 'Berberler yüklenemedi.') : null,
    refetch,
  };
}
