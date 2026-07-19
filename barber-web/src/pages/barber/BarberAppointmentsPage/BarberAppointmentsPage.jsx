import { useState, useEffect } from 'react';
import {
  Container, Typography, CircularProgress, Stack
} from '@mui/material';
import api from '@/api/axios';
import AppointmentCard from '@/components/AppointmentCard';

export default function BarberAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const fetchAppointments = () => {
    setIsLoading(true);
    api.get('/appointments/barber')
      .then((res) => setAppointments(res.data?.list ?? []))
      .catch(() => setAppointments([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdating(id);
    try {
      await api.patch(`/appointments/${id}/status`, { status: newStatus });
      fetchAppointments();
    } catch {
      // ignore
    } finally {
      setUpdating(null);
    }
  };

  return (
      <Container maxWidth="md" sx={{ py: 6, flex: 1 }}>
        <Typography variant="h4" fontWeight={700} mb={4}>Randevularım</Typography>

        {isLoading && <CircularProgress />}

        {!isLoading && appointments.length === 0 && (
          <Typography color="text.secondary">Randevu bulunamadı.</Typography>
        )}

        <Stack spacing={2}>
          {appointments.map((apt) => (
            <AppointmentCard
              key={apt.appointmentsId}
              apt={apt}
              showDate
              showActions
              onStatusChange={handleStatusChange}
              updating={updating === apt.appointmentsId}
            />
          ))}
        </Stack>
      </Container>
  );
}
