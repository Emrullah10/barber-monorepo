import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Container, Typography, TextField, Button, Alert,
  CircularProgress, Card, CardContent, Link,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useAuthStore } from '@/store/authStore';
import api from '@/api/axios';

export default function RegisterPage() {
  const navigate = useNavigate();
  const loginAction = useAuthStore((s) => s.loginAction);
  const [form, setForm] = useState({ usersName: '', usersEmail: '', usersPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.usersName || !form.usersEmail || !form.usersPassword) {
      setError('Tüm alanlar zorunludur.');
      return;
    }
    if (form.usersPassword !== form.confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }
    if (form.usersPassword.length < 4) {
      setError('Şifre en az 4 karakter olmalıdır.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/register', {
        usersName: form.usersName,
        usersEmail: form.usersEmail,
        usersPassword: form.usersPassword,
      });
      const { token, user } = res.data;
      loginAction(user, token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Kayıt sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 }, flex: 1, display: 'flex', alignItems: 'center' }}>
        <Card sx={{ width: '100%', borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box sx={{
                width: 56, height: 56, borderRadius: '50%', bgcolor: 'primary.main',
                display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2,
              }}>
                <PersonAddIcon sx={{ color: '#fff', fontSize: 28 }} />
              </Box>
              <Typography variant="h4" sx={{ fontFamily: "'Literata', serif", fontWeight: 700 }}>
                Create Account
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Join Terra Barber to book appointments or manage your shop.
              </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth label="Ad Soyad" value={form.usersName}
                onChange={handleChange('usersName')} sx={{ mb: 2 }}
              />
              <TextField
                fullWidth label="Email" type="email" value={form.usersEmail}
                onChange={handleChange('usersEmail')} sx={{ mb: 2 }}
              />
              <TextField
                fullWidth label="Şifre" type="password" value={form.usersPassword}
                onChange={handleChange('usersPassword')} sx={{ mb: 2 }}
              />
              <TextField
                fullWidth label="Şifre Tekrar" type="password" value={form.confirmPassword}
                onChange={handleChange('confirmPassword')} sx={{ mb: 3 }}
              />

              <Button
                type="submit" fullWidth variant="contained" size="large"
                disabled={loading}
                sx={{ py: 1.5, textTransform: 'none', fontWeight: 700, borderRadius: 2, mb: 2 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Kayıt Ol'}
              </Button>

              <Typography variant="body2" color="text.secondary" textAlign="center">
                Zaten hesabın var mı?{' '}
                <Link component={RouterLink} to="/login" sx={{ fontWeight: 600 }}>
                  Giriş Yap
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
