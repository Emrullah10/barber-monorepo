import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function SuccessStep({ createdShop }) {
  const navigate = useNavigate();
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: { xs: 4, md: 6 }, textAlign: 'center' }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" fontWeight={700} sx={{ fontFamily: "'Literata', serif", mb: 1 }}>
          Dükkanınız Hazır!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 480, mx: 'auto' }}>
          <strong>{createdShop?.tenantName}</strong> başarıyla oluşturuldu.
          Artık hizmet ekleyebilir, berber davet edebilir ve randevu almaya başlayabilirsiniz.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained" onClick={() => navigate('/barber/services')}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Hizmet Ekle
          </Button>
          <Button
            variant="outlined" onClick={() => navigate('/barber/shop-barbers')}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Berber Ekle
          </Button>
          <Button
            variant="text" onClick={() => navigate('/barber/dashboard')}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Panele Git
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
