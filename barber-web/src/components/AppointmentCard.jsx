import { Box, Card, CardContent, Chip, Stack, Typography, Button } from '@mui/material';

const STATUS_COLOR = {
  pending: 'warning',
  confirmed: 'success',
  cancelled: 'error',
  completed: 'default',
};

const STATUS_LABEL = {
  pending: 'Bekliyor',
  confirmed: 'Onaylandı',
  cancelled: 'İptal',
  completed: 'Tamamlandı',
};

/**
 * @param {object} apt - appointment object
 * @param {boolean} showDate - show appointmentDate in addition to time
 * @param {boolean} showActions - show confirm/cancel/complete buttons
 * @param {function} onStatusChange - (id, newStatus) => void
 * @param {boolean} updating - whether this card's action is loading
 */
export default function AppointmentCard({ apt, showDate = false, showActions = false, onStatusChange, updating = false }) {
  return (
    <Card variant="outlined">
      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems={showActions ? 'flex-start' : 'center'}>
          <Box>
            <Typography fontWeight={600}>
              {showDate ? `${apt.appointmentDate} — ` : ''}{apt.appointmentTime} — {apt.customerName ?? 'Müşteri'}
            </Typography>
            <Typography variant="body2" color="text.secondary">{apt.serviceName ?? 'Hizmet'}</Typography>
          </Box>
          <Stack alignItems="flex-end" spacing={1}>
            <Chip
              label={STATUS_LABEL[apt.appointmentStatus] ?? apt.appointmentStatus}
              color={STATUS_COLOR[apt.appointmentStatus] ?? 'default'}
              size="small"
            />
            {showActions && apt.appointmentStatus === 'pending' && (
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  disabled={updating}
                  onClick={() => onStatusChange?.(apt.appointmentsId, 'confirmed')}
                >
                  Onayla
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  disabled={updating}
                  onClick={() => onStatusChange?.(apt.appointmentsId, 'cancelled')}
                >
                  İptal
                </Button>
              </Stack>
            )}
            {showActions && apt.appointmentStatus === 'confirmed' && (
              <Button
                size="small"
                variant="contained"
                disabled={updating}
                onClick={() => onStatusChange?.(apt.appointmentsId, 'completed')}
              >
                Tamamlandı
              </Button>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
