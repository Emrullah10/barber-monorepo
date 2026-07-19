import { useState } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Chip,
  Button, CircularProgress, Alert, Stack
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import useAppointments from '@/features/appointments/hooks/useAppointments';
import api from '@/api/axios';

const STATUS_COLOR = {
  pending: 'warning',
  confirmed: 'success',
  cancelled: 'error',
  completed: 'default',
};

const STATUS_LABEL = {
  pending: 'Bekliyor',
  confirmed: 'Onaylandı',
  cancelled: 'İptal Edildi',
  completed: 'Tamamlandı',
};

export default function MyAppointmentsPage() {
  const { appointments, isLoading, error, refetch } = useAppointments();
  const [cancelling, setCancelling] = useState(null);

  const handleCancel = async (id) => {
    setCancelling(id);
    try {
      await api.patch(`/appointments/${id}/status`, { status: 'cancelled' });
      refetch();
    } catch {
      // ignore
    } finally {
      setCancelling(null);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container maxWidth="md" sx={{ py: 6, flex: 1 }}>
        <Typography variant="h4" fontWeight={700} mb={4}>
          Randevularım
        </Typography>

        {isLoading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {!isLoading && appointments.length === 0 && (
          <Alert severity="info">Henüz randevunuz bulunmamaktadır.</Alert>
        )}

        <Stack spacing={2}>
          {appointments.map((apt) => (
            <Card key={apt.appointmentsId} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                      <ContentCutIcon fontSize="small" color="primary" />
                      <Typography fontWeight={600}>{apt.serviceName ?? 'Hizmet'}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={2}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <CalendarMonthIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">{apt.appointmentDate}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <AccessTimeIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">{apt.appointmentTime}</Typography>
                      </Stack>
                    </Stack>
                    {apt.barberName && (
                      <Typography variant="body2" color="text.secondary" mt={0.5}>
                        Berber: {apt.barberName}
                      </Typography>
                    )}
                  </Box>
                  <Stack alignItems="flex-end" spacing={1}>
                    <Chip
                      label={STATUS_LABEL[apt.appointmentStatus] ?? apt.appointmentStatus}
                      color={STATUS_COLOR[apt.appointmentStatus] ?? 'default'}
                      size="small"
                    />
                    {['pending', 'confirmed'].includes(apt.appointmentStatus) && (
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        disabled={cancelling === apt.appointmentsId}
                        onClick={() => handleCancel(apt.appointmentsId)}
                      >
                        İptal Et
                      </Button>
                    )}
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
