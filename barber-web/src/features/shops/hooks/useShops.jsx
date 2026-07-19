import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';
import { queryKeys } from '@/shared/constant/query-keys';

export const useShops = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: queryKeys.shops.all,
        queryFn: async () => {
            const response = await api.get('/tenants');
            return response.data?.list ?? [];
        },
    });

    return {
        shops: data ?? [],
        isLoading,
        error: error ? (error.response?.data?.message || 'Dükkanlar yüklenirken hata oluştu.') : null,
        refetch,
    };
};

export const useShopDetail = (slug) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: queryKeys.shops.detail(slug),
        queryFn: async () => {
            const response = await api.get(`/tenants/slug/${slug}`);
            return response.data?.item ?? null;
        },
        enabled: Boolean(slug),
    });

    return {
        shop: data ?? null,
        isLoading,
        error: error ? (error.response?.data?.message || 'Dükkan bilgisi yüklenirken hata oluştu.') : null,
        refetch,
    };
};
