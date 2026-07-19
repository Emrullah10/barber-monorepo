import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import CreateShopDialog from './components/CreateShopDialog';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useShops } from '@/features/shops/hooks/useShops';
import api from '@/api/axios';

export default function AdminShopsPage() {
  const { shops, isLoading, error, refetch } = useShops();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ tenantName: '', tenantSlug: '', tenantCity: '', ownerUserId: '' });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);
  const [snack, setSnack] = useState('');

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleCreate = async () => {
    if (!form.tenantName || !form.tenantSlug) {
      setFormError('Dukkan adi ve slug zorunludur.');
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      await api.post('/tenants', {
        tenantName: form.tenantName,
        tenantSlug: form.tenantSlug,
        tenantCity: form.tenantCity || null,
        ownerUserId: form.ownerUserId ? parseInt(form.ownerUserId) : null,
      });
      setSnack('Dukkan olusturuldu.');
      setDialogOpen(false);
      setForm({ tenantName: '', tenantSlug: '', tenantCity: '', ownerUserId: '' });
      refetch();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Dukkan olusturulurken hata olustu.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
    <Box sx={{ py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              sx={{ fontFamily: "'Literata', serif", fontWeight: 700, color: 'text.primary' }}
            >
              Dukkan Yonetimi
            </Typography>
            <Button variant="contained" startIcon={<AddBusinessIcon />} onClick={() => setDialogOpen(true)}>
              Yeni Dukkan
            </Button>
          </Box>

          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          )}

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          {!isLoading && !error && shops.length === 0 && (
            <Alert severity="info">Henuz dukkan bulunmuyor.</Alert>
          )}

          {!isLoading && !error && shops.length > 0 && (
            <Grid container spacing={3}>
              {shops.map((shop) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={shop.tenantId}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: 1, p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <StorefrontIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                        <Typography variant="h6" fontWeight={700} sx={{ fontFamily: "'Literata', serif" }}>
                          {shop.tenantName}
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Slug: <strong>{shop.tenantSlug}</strong>
                      </Typography>

                      {shop.tenantCity && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                          <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">{shop.tenantCity}</Typography>
                        </Box>
                      )}

                      <Box sx={{ mt: 1.5, display: 'flex', gap: 1 }}>
                        <Chip label={`ID: ${shop.tenantId}`} size="small" variant="outlined" />
                        <Chip
                          label={shop.tenantIsActive ? 'Aktif' : 'Pasif'}
                          size="small"
                          color={shop.tenantIsActive ? 'success' : 'default'}
                        />
                      </Box>
                    </CardContent>
                    <CardActions sx={{ px: 3, pb: 2 }}>
                      <Button size="small" href={`/shops/${shop.tenantSlug}`}>Goruntule</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      <CreateShopDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        form={form}
        onChange={handleChange}
        formError={formError}
        saving={saving}
        onCreate={handleCreate}
      />

      <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack('')} message={snack} />
    </>
  );
}
