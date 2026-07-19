import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';

const signatureServices = [
  { name: 'Classic Haircut', price: 45, duration: 45, icon: <ContentCutIcon /> },
  { name: 'Beard Sculpting', price: 35, duration: 30, icon: <FaceRetouchingNaturalIcon /> },
  { name: 'Classic Head Shave', price: 40, duration: 40, icon: <ContentCutIcon /> },
];

export default function ServicesShowcase() {
  const navigate = useNavigate();
  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ fontFamily: "'Literata', serif", mb: 2, textAlign: 'center' }}>
          Our Signature Services
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 8, maxWidth: 500, mx: 'auto' }}>
          Every service is an experience crafted with precision and care.
        </Typography>

        {/* Deluxe Grooming Spotlight */}
        <Card
          sx={{
            p: { xs: 3, md: 6 },
            mb: 4,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
            '&:hover': { transform: 'translateY(-4px)' },
          }}
          onClick={() => navigate('/booking')}
        >
          <Box sx={{ flex: 1 }}>
            <Chip label="SPOTLIGHT SERVICE" size="small" sx={{ mb: 2, fontWeight: 700, bgcolor: 'primary.main', color: 'primary.contrastText' }} />
            <Typography variant="h3" gutterBottom sx={{ fontFamily: "'Literata', serif" }}>
              Deluxe Grooming
            </Typography>
            <Typography variant="h4" sx={{ color: 'primary.main', fontFamily: "'Literata', serif", mb: 2 }}>
              $85
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, fontSize: '1.05rem' }}>
              Our ultimate experience. Includes a precision haircut, signature beard sculpt,
              hot towel aromatic steam, and a relaxing scalp massage.
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CheckCircleOutlineIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                  <Typography variant="body2" fontWeight={600}>90 Minutes Treatment</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CheckCircleOutlineIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                  <Typography variant="body2" fontWeight={600}>Premium Products</Typography>
                </Box>
              </Grid>
            </Grid>
            <Button variant="contained" size="large" sx={{ mt: 4 }} onClick={(e) => { e.stopPropagation(); navigate('/booking'); }}>
              Select Service
            </Button>
          </Box>
          <Box
            sx={{
              width: { xs: '100%', md: 320 },
              height: { xs: 200, md: 300 },
              borderRadius: '20px',
              bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(157, 211, 170, 0.03)' : 'rgba(74, 124, 89, 0.05)',
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ContentCutIcon sx={{ fontSize: 80, color: 'primary.main', opacity: 0.1 }} />
          </Box>
        </Card>

        {/* Service Cards Grid */}
        <Grid container spacing={3}>
          {signatureServices.map((s) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={s.name}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
                onClick={() => navigate('/booking')}
              >
                <Box
                  sx={{
                    height: 140,
                    bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(157, 211, 170, 0.03)' : 'rgba(74, 124, 89, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box sx={{ fontSize: 48, color: 'primary.main', opacity: 0.15, '& .MuiSvgIcon-root': { fontSize: 48 } }}>
                    {s.icon}
                  </Box>
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontFamily: "'Literata', serif" }}>
                    {s.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label={`$${s.price}`} size="small" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 700 }} />
                    <Chip
                      icon={<AccessTimeIcon sx={{ fontSize: '14px !important' }} />}
                      label={`${s.duration} min`}
                      size="small"
                      variant="outlined"
                      sx={{ borderColor: 'divider', color: 'text.secondary' }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {/* Loyalty Program Card */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{
                height: '100%',
                bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(157, 211, 170, 0.06)' : 'rgba(74, 124, 89, 0.06)',
                border: '1px dashed',
                borderColor: 'primary.main',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                p: 4,
                cursor: 'pointer',
                '&:hover': { transform: 'translateY(-4px)' },
              }}
            >
              <LoyaltyIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2, opacity: 0.7 }} />
              <Typography variant="h6" fontWeight={700} sx={{ fontFamily: "'Literata', serif", mb: 1 }}>
                Loyalty Program
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                6th haircut is free
              </Typography>
              <Chip label="JOIN NOW" size="small" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 700 }} />
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button variant="outlined" size="large" onClick={() => navigate('/services')} sx={{ px: 5 }}>
            View All Services
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
