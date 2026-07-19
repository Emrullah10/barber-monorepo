import { useState, useEffect } from 'react';
import api from '@/api/axios';

export const useShops = () => {
    const [shops, setShops] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchShops = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get('/tenants');
            setShops(response.data?.list ?? []);
        } catch (err) {
            setError(err.response?.data?.message || 'Dükkanlar yüklenirken hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchShops();
    }, []);

    return { shops, isLoading, error, refetch: fetchShops };
};

export const useShopDetail = (slug) => {
    const [shop, setShop] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchShop = async () => {
        if (!slug) return;
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get(`/tenants/slug/${slug}`);
            setShop(response.data?.item ?? null);
        } catch (err) {
            setError(err.response?.data?.message || 'Dükkan bilgisi yüklenirken hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchShop();
    }, [slug]);

    return { shop, isLoading, error, refetch: fetchShop };
};
