import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function SuccessScreen({ shop, slug, selectedService }) {
  const navigate = useNavigate();
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: { xs: 4, md: 6 }, textAlign: 'center' }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" fontWeight={700} color="text.primary" sx={{ fontFamily: "'Literata', serif", mb: 1 }}>
          Randevunuz Alındı!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 420, mx: 'auto' }}>
          {shop.tenantName} - {selectedService?.servicesName} randevunuz başarıyla oluşturuldu.
          Randevu detaylarınızı "Randevularım" sayfasından takip edebilirsiniz.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="contained" onClick={() => navigate('/my-appointments')} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Randevularım
          </Button>
          <Button variant="outlined" onClick={() => navigate(`/shops/${slug}`)} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Dükkana Dön
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
