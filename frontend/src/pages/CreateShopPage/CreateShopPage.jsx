import { useState } from 'react';
import {
  Box, Container, Typography, Stepper, Step, StepLabel,
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useAuthStore } from '@/store/authStore';
import api from '@/api/axios';
import ShopInfoStep from './components/ShopInfoStep';
import LocationStep from './components/LocationStep';
import SuccessStep from './components/SuccessStep';

const STEPS = ['Dükkan Bilgileri', 'Konum & İletişim', 'Tamamlandı'];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function CreateShopPage() {
  const loginAction = useAuthStore((s) => s.loginAction);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createdShop, setCreatedShop] = useState(null);

  const [form, setForm] = useState({
    tenantName: '',
    tenantSlug: '',
    tenantPhone: '',
    tenantEmail: '',
    tenantAddress: '',
    tenantCity: '',
    tenantPhotoUrl: '',
    tenantLatitude: '',
    tenantLongitude: '',
  });

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((p) => ({
      ...p,
      [field]: value,
      ...(field === 'tenantName' && !p._slugEdited ? { tenantSlug: slugify(value) } : {}),
    }));
  };

  const handleSlugChange = (e) => {
    setForm((p) => ({ ...p, tenantSlug: slugify(e.target.value), _slugEdited: true }));
  };

  const handleStep0Next = () => {
    if (!form.tenantName) { setError('Dükkan adı zorunludur.'); return; }
    setError(null);
    setActiveStep(1);
  };

  const handleSubmit = async () => {
    setError(null);
    if (!form.tenantName || !form.tenantSlug) {
      setError('Dükkan adı zorunludur.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        tenantName: form.tenantName,
        tenantSlug: form.tenantSlug,
        tenantPhone: form.tenantPhone || null,
        tenantEmail: form.tenantEmail || null,
        tenantAddress: form.tenantAddress || null,
        tenantCity: form.tenantCity || null,
        tenantPhotoUrl: form.tenantPhotoUrl || null,
        tenantLatitude: form.tenantLatitude ? parseFloat(form.tenantLatitude) : null,
        tenantLongitude: form.tenantLongitude ? parseFloat(form.tenantLongitude) : null,
      };
      const res = await api.post('/onboard/shop', payload);
      const shop = res.data?.item;
      setCreatedShop(shop);
      loginAction(
        {
          ...user,
          userTypeCode: 'manager_barber',
          userTypeName: 'Manager Barber',
          tenantId: shop.tenantId,
          tenantSlug: shop.tenantSlug,
          tenantName: shop.tenantName,
        },
        token,
      );
      setActiveStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Dükkan oluşturulurken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 }, flex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{
            width: 56, height: 56, borderRadius: '50%', bgcolor: 'primary.main',
            display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2,
          }}>
            <StorefrontIcon sx={{ color: '#fff', fontSize: 28 }} />
          </Box>
          <Typography variant="h4" sx={{ fontFamily: "'Literata', serif", fontWeight: 700 }}>
            Open Your Shop
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Set up your barbershop on Terra Barber in just a few steps.
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
          {STEPS.map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <ShopInfoStep
            form={form}
            onChange={handleChange}
            onSlugChange={handleSlugChange}
            error={error}
            onNext={handleStep0Next}
          />
        )}

        {activeStep === 1 && (
          <LocationStep
            form={form}
            onChange={handleChange}
            error={error}
            loading={loading}
            onBack={() => setActiveStep(0)}
            onSubmit={handleSubmit}
          />
        )}

        {activeStep === 2 && (
          <SuccessStep createdShop={createdShop} />
        )}
      </Container>
    </Box>
  );
}
