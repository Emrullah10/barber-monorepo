import { useState, useEffect } from 'react';
import api from '@/api/axios';

export default function useAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/appointments/my');
      setAppointments(response.data?.list ?? []);
    } catch (err) {
      // API henüz aktif değilse sessizce boş liste döndür
      if (err.response?.status === 404 || err.response?.status === 501) {
        setAppointments([]);
      } else if (err.response?.status !== 401) {
        setError(err.response?.data?.message ?? 'Randevular yüklenemedi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return { appointments, isLoading, error, refetch: fetchAppointments };
}
