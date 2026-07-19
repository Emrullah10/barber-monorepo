import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import SaveIcon from '@mui/icons-material/Save';
import { useAuthStore } from '@/store/authStore';
import api from '@/api/axios';

export default function ShopSettingsPage() {
  const user = useAuthStore((s) => s.user);
  const [form, setForm] = useState({ tenantName: '', tenantPhone: '', tenantEmail: '', tenantAddress: '', tenantCity: '', tenantPhotoUrl: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [snack, setSnack] = useState('');

  useEffect(() => {
    if (!user?.tenantId) return;
    const fetchTenant = async () => {
      try {
        const res = await api.get(`/tenants/${user.tenantId}`);
        const t = res.data?.item;
        if (t) setForm({
          tenantName: t.tenantName || '',
          tenantPhone: t.tenantPhone || '',
          tenantEmail: t.tenantEmail || '',
          tenantAddress: t.tenantAddress || '',
          tenantCity: t.tenantCity || '',
          tenantPhotoUrl: t.tenantPhotoUrl || '',
        });
      } catch (err) {
        setError('Dukkan bilgileri yuklenemedi.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTenant();
  }, [user?.tenantId]);

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await api.put(`/tenants/${user.tenantId}`, form);
      setSnack('Dukkan bilgileri guncellendi.');
    } catch (err) {
      setError(err.response?.data?.message || 'Guncelleme sirasinda hata olustu.');
    } finally {
      setSaving(false);
    }
  };

  if (!user?.tenantId) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="warning">Bagli oldugunuz bir dukkan bulunamadi.</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="md">
          <Typography
            variant="h4"
            sx={{ fontFamily: "'Literata', serif", fontWeight: 700, color: 'text.primary', mb: 4 }}
          >
            Dukkan Ayarlari
          </Typography>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Card>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth label="Dukkan Adi" value={form.tenantName} onChange={handleChange('tenantName')} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Telefon" value={form.tenantPhone} onChange={handleChange('tenantPhone')} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="E-posta" value={form.tenantEmail} onChange={handleChange('tenantEmail')} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Sehir" value={form.tenantCity} onChange={handleChange('tenantCity')} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Fotograf URL" value={form.tenantPhotoUrl} onChange={handleChange('tenantPhotoUrl')} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth label="Adres" value={form.tenantAddress} onChange={handleChange('tenantAddress')} multiline rows={2} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      disabled={saving}
                      sx={{ mt: 1 }}
                    >
                      {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </Container>
      <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack('')} message={snack} />
    </Box>
  );
}
