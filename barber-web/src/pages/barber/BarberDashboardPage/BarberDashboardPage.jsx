import { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid,
  CircularProgress, Stack
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import api from '@/api/axios';
import StatCard from '@/components/StatCard';
import AppointmentCard from '@/components/AppointmentCard';


export default function BarberDashboardPage() {
  const { user, isAnyBarber } = useRoleGuard();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/appointments/barber')
      .then((res) => setAppointments(res.data?.list ?? []))
      .catch(() => setAppointments([]))
      .finally(() => setIsLoading(false));
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayApts = appointments.filter((a) => String(a.appointmentDate).slice(0, 10) === today);
  const pendingCount = appointments.filter((a) => a.appointmentStatus === 'pending').length;
  const confirmedCount = appointments.filter((a) => a.appointmentStatus === 'confirmed').length;

  const stats = [
    { label: 'Bugünkü Randevular', value: todayApts.length, icon: <EventIcon />, color: '#4a7c59' },
    { label: 'Bekleyen', value: pendingCount, icon: <PendingIcon />, color: '#705c30' },
    { label: 'Onaylanan', value: confirmedCount, icon: <CheckCircleIcon />, color: '#2e7d32' },
    { label: 'Toplam', value: appointments.length, icon: <PeopleIcon />, color: '#1565c0' },
  ];

  return (
      <Container maxWidth="lg" sx={{ py: 6, flex: 1 }}>
        <Typography variant="h4" fontWeight={700} mb={1}>
          Hoş geldin, {user?.usersName}
        </Typography>
        <Typography color="text.secondary" mb={4}>
          {isAnyBarber() ? 'Berber Paneli' : 'Panel'}
        </Typography>

        <Grid container spacing={3} mb={5}>
          {stats.map((s) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={s.label}>
              <StatCard title={s.label} value={s.value} icon={s.icon} color={s.color} />
            </Grid>
          ))}
        </Grid>

        <Typography variant="h6" fontWeight={600} mb={2}>
          Bugünün Randevuları ({today})
        </Typography>

        {isLoading && <CircularProgress />}

        {!isLoading && todayApts.length === 0 && (
          <Typography color="text.secondary">Bugün randevu yok.</Typography>
        )}

        <Stack spacing={1.5}>
          {todayApts.map((apt) => (
            <AppointmentCard key={apt.appointmentsId} apt={apt} />
          ))}
        </Stack>
      </Container>
  );
}
