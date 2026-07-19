import { useState } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Stack,
  TextField, Button, Alert, CircularProgress, Chip
} from '@mui/material';
import { useServices } from '@/features/services/hooks/useServices';
import api from '@/api/axios';

export default function BarberServicesPage() {
  const { services, isLoading, error, refetch } = useServices();
  const [editing, setEditing] = useState(null); // { servicesId, servicesPrice, servicesDuration }
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleEdit = (svc) => {
    setEditing({ servicesId: svc.servicesId, servicesPrice: svc.servicesPrice, servicesDuration: svc.servicesDuration });
    setSaveError(null);
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      await api.put(`/services/${editing.servicesId}`, {
        servicesPrice: editing.servicesPrice,
        servicesDuration: editing.servicesDuration,
      });
      setSaveSuccess(true);
      setEditing(null);
      refetch();
    } catch (err) {
      setSaveError(err.response?.data?.message ?? 'Kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  };

  return (
      <Container maxWidth="md" sx={{ py: 6, flex: 1 }}>
        <Typography variant="h4" fontWeight={700} mb={4}>Hizmet Yönetimi</Typography>

        {saveSuccess && <Alert severity="success" sx={{ mb: 2 }}>Hizmet güncellendi.</Alert>}
        {saveError && <Alert severity="error" sx={{ mb: 2 }}>{saveError}</Alert>}

        {isLoading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        <Stack spacing={2}>
          {services.map((svc) => (
            <Card key={svc.servicesId} variant="outlined">
              <CardContent>
                {editing?.servicesId === svc.servicesId ? (
                  <Stack spacing={2}>
                    <Typography fontWeight={600}>{svc.servicesName}</Typography>
                    <Stack direction="row" spacing={2}>
                      <TextField
                        label="Fiyat (₺)"
                        type="number"
                        value={editing.servicesPrice}
                        onChange={(e) => setEditing((p) => ({ ...p, servicesPrice: e.target.value }))}
                        size="small"
                        sx={{ width: 140 }}
                      />
                      <TextField
                        label="Süre (dk)"
                        type="number"
                        value={editing.servicesDuration}
                        onChange={(e) => setEditing((p) => ({ ...p, servicesDuration: e.target.value }))}
                        size="small"
                        sx={{ width: 140 }}
                      />
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Button variant="contained" size="small" onClick={handleSave} disabled={saving}>
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                      </Button>
                      <Button variant="outlined" size="small" onClick={() => setEditing(null)}>
                        İptal
                      </Button>
                    </Stack>
                  </Stack>
                ) : (
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography fontWeight={600}>{svc.servicesName}</Typography>
                      <Stack direction="row" spacing={1} mt={0.5}>
                        <Chip label={`₺${svc.servicesPrice}`} size="small" color="primary" />
                        <Chip label={`${svc.servicesDuration} dk`} size="small" variant="outlined" />
                      </Stack>
                    </Box>
                    <Button size="small" variant="outlined" onClick={() => handleEdit(svc)}>
                      Düzenle
                    </Button>
                  </Stack>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Container>
  );
}
