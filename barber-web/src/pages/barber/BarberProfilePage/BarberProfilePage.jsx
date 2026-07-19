import { useState, useEffect } from 'react';
import {
  Box, Container, Typography, TextField, Button,
  Alert, CircularProgress, Stack, Avatar, Card, CardContent
} from '@mui/material';
import { useAuthStore } from '@/store/authStore';
import api from '@/api/axios';

export default function BarberProfilePage() {
  const user = useAuthStore((s) => s.user);
  const [form, setForm] = useState({ usersSpecialty: '', usersBio: '', usersPhotoUrl: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/barbers/${user?.usersId}`)
      .then((res) => {
        const d = res.data?.data ?? {};
        setForm({
          usersSpecialty: d.usersSpecialty ?? '',
          usersBio: d.usersBio ?? '',
          usersPhotoUrl: d.usersPhotoUrl ?? '',
        });
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [user?.usersId]);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    setError(null);
    try {
      await api.put('/profile', form);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message ?? 'Kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  };

  return (
      <Container maxWidth="sm" sx={{ py: 6, flex: 1 }}>
        <Typography variant="h4" fontWeight={700} mb={4}>Profilim</Typography>

        {isLoading ? (
          <CircularProgress />
        ) : (
          <Card variant="outlined">
            <CardContent>
              <Stack alignItems="center" mb={3}>
                <Avatar
                  src={form.usersPhotoUrl || undefined}
                  sx={{ width: 80, height: 80, mb: 1, bgcolor: 'primary.main', fontSize: 32 }}
                >
                  {user?.usersName?.[0]?.toUpperCase()}
                </Avatar>
                <Typography fontWeight={600}>{user?.usersName}</Typography>
                <Typography variant="body2" color="text.secondary">{user?.userTypeName}</Typography>
              </Stack>

              <Stack spacing={2}>
                <TextField
                  label="Fotoğraf URL"
                  value={form.usersPhotoUrl}
                  onChange={(e) => setForm((f) => ({ ...f, usersPhotoUrl: e.target.value }))}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Uzmanlık"
                  value={form.usersSpecialty}
                  onChange={(e) => setForm((f) => ({ ...f, usersSpecialty: e.target.value }))}
                  fullWidth
                  size="small"
                  placeholder="örn: Klasik Kesim, Sakal Bakımı"
                />
                <TextField
                  label="Biyografi"
                  value={form.usersBio}
                  onChange={(e) => setForm((f) => ({ ...f, usersBio: e.target.value }))}
                  fullWidth
                  multiline
                  rows={4}
                  size="small"
                />

                {success && <Alert severity="success">Profil güncellendi.</Alert>}
                {error && <Alert severity="error">{error}</Alert>}

                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Container>
  );
}
