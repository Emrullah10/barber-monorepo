import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';
import { queryKeys } from '@/shared/constant/query-keys';

export const useServices = (tenantId = null) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: queryKeys.services.list(tenantId),
        queryFn: async () => {
            const url = tenantId ? `/services/public?tenantId=${tenantId}` : '/services';
            const response = await api.get(url);
            return response.data?.list ?? [];
        },
    });

    return {
        services: data ?? [],
        isLoading,
        error: error ? (error.response?.data?.message || 'Hizmetler yüklenirken bir ağ hatası oluştu.') : null,
        refetch,
    };
};
