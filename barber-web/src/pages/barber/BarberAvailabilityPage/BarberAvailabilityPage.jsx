import { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Stack,
  FormControlLabel, Checkbox, TextField, Button, Alert, CircularProgress, Divider
} from '@mui/material';
import api from '@/api/axios';

const DAYS = [
  { key: 1, label: 'Pazartesi' },
  { key: 2, label: 'Salı' },
  { key: 3, label: 'Çarşamba' },
  { key: 4, label: 'Perşembe' },
  { key: 5, label: 'Cuma' },
  { key: 6, label: 'Cumartesi' },
  { key: 0, label: 'Pazar' },
];

const defaultDay = () => ({ isAvailable: false, startTime: '09:00', endTime: '18:00' });

export default function BarberAvailabilityPage() {
  const [availability, setAvailability] = useState(
    Object.fromEntries(DAYS.map((d) => [d.key, defaultDay()]))
  );
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/availability')
      .then((res) => {
        const list = res.data?.list ?? [];
        const updated = { ...Object.fromEntries(DAYS.map((d) => [d.key, defaultDay()])) };
        list.forEach((item) => {
          if (item.dayOfWeek !== undefined) {
            updated[item.dayOfWeek] = {
              isAvailable: item.isAvailable ?? false,
              startTime: item.startTime ?? '09:00',
              endTime: item.endTime ?? '18:00',
            };
          }
        });
        setAvailability(updated);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    setError(null);
    const payload = DAYS.map((d) => ({
      dayOfWeek: d.key,
      ...availability[d.key],
    }));
    try {
      await api.put('/availability', { availability: payload });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message ?? 'Kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  };

  const update = (dayKey, field, value) =>
    setAvailability((prev) => ({ ...prev, [dayKey]: { ...prev[dayKey], [field]: value } }));

  return (
      <Container maxWidth="sm" sx={{ py: 6, flex: 1 }}>
        <Typography variant="h4" fontWeight={700} mb={4}>Müsaitlik Saatleri</Typography>

        {isLoading ? (
          <CircularProgress />
        ) : (
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={2}>
                {DAYS.map((day) => {
                  const d = availability[day.key];
                  return (
                    <Box key={day.key}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={d.isAvailable}
                            onChange={(e) => update(day.key, 'isAvailable', e.target.checked)}
                          />
                        }
                        label={<Typography fontWeight={600}>{day.label}</Typography>}
                      />
                      {d.isAvailable && (
                        <Stack direction="row" spacing={2} ml={4}>
                          <TextField
                            label="Başlangıç"
                            type="time"
                            value={d.startTime}
                            onChange={(e) => update(day.key, 'startTime', e.target.value)}
                            size="small"
                            InputLabelProps={{ shrink: true }}
                          />
                          <TextField
                            label="Bitiş"
                            type="time"
                            value={d.endTime}
                            onChange={(e) => update(day.key, 'endTime', e.target.value)}
                            size="small"
                            InputLabelProps={{ shrink: true }}
                          />
                        </Stack>
                      )}
                      <Divider sx={{ mt: 1.5 }} />
                    </Box>
                  );
                })}

                {success && <Alert severity="success">Müsaitlik saatleri kaydedildi.</Alert>}
                {error && <Alert severity="error">{error}</Alert>}

                <Button variant="contained" onClick={handleSave} disabled={saving}>
                  {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Container>
  );
}
