import { useState, useEffect } from 'react';
import api from '@/api/axios';

/**
 * Servisleri (Hizmetleri) Backend Gateway'den (Port 5001) çeken Amiyane İşçi Hook.
 */
export const useServices = (tenantId = null) => {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchServices = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const url = tenantId ? `/services/public?tenantId=${tenantId}` : '/services';
            const response = await api.get(url);
            setServices(response.data?.list ?? []);
        } catch (err) {
            setError(err.response?.data?.message || 'Hizmetler yüklenirken bir ağ hatası oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, [tenantId]);

    return { services, isLoading, error, refetch: fetchServices };
};
