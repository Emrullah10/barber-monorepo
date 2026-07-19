import { useState, useEffect } from 'react';
import api from '@/api/axios';

export default function useBarbers() {
  const [barbers, setBarbers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBarbers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/barbers');
      setBarbers(response.data?.list ?? []);
    } catch (err) {
      setError(err.response?.data?.message ?? 'Berberler yüklenemedi.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBarbers();
  }, []);

  return { barbers, isLoading, error, refetch: fetchBarbers };
}
