import { useState } from 'react';
import api from '@/api/axios';

export default function useCreateAppointment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createAppointment = async ({ servicesId, appointmentDate, appointmentTime, barberId, tenantId }) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await api.post('/appointments', { servicesId, appointmentDate, appointmentTime, barberId, tenantId });
      setSuccess(true);
      return true;
    } catch (err) {
      if (err.response?.status === 404 || err.response?.status === 501) {
        setError('Randevu sistemi yakında aktif olacak.');
      } else {
        setError(err.response?.data?.message ?? 'Randevu oluşturulamadı.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { createAppointment, isLoading, error, success };
}
