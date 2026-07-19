import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import StorefrontIcon from '@mui/icons-material/Storefront';
import StarIcon from '@mui/icons-material/Star';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import SpaIcon from '@mui/icons-material/Spa';
import MapView from '@/components/MapView';
import HeroSearch from './components/HeroSearch';

const topShops = [
  { id: 1, name: 'Iron & Taper Studio', location: 'Downtown District', distance: '2.4 mi', rating: 4.9 },
  { id: 2, name: 'The Oak & Razor', location: 'West End', distance: '0.8 mi', rating: 4.8 },
  { id: 3, name: 'Verdant Grooming Co.', location: 'Garden District', distance: '1.2 mi', rating: 5.0 },
];

const popularServices = [
  { id: 's1', name: 'Classic Haircut', desc: 'Precision cut & style', price: '$35+', icon: <ContentCutIcon /> },
  { id: 's2', name: 'Beard Sculpt', desc: 'Trim, shape & oil', price: '$20+', icon: <FaceRetouchingNaturalIcon /> },
  { id: 's3', name: 'Hot Towel Shave', desc: 'Traditional straight razor', price: '$45+', icon: <ContentCutIcon /> },
  { id: 's4', name: 'Grey Blending', desc: 'Natural color enhancement', price: '$55+', icon: <SpaIcon /> },
  { id: 's5', name: 'Total Package', desc: 'The ultimate grooming', price: '$90+', icon: <ContentCutIcon /> },
  { id: 's6', name: 'Scalp Therapy', desc: 'Deep cleanse & massage', price: '$40+', icon: <SpaIcon /> },
];

export default function DiscoverPage() {
  const navigate = useNavigate();
  const [shopIndex, setShopIndex] = useState(0);
  const [viewMode, setViewMode] = useState('list');

  const handlePrevShop = () => setShopIndex((i) => Math.max(0, i - 1));
  const handleNextShop = () => setShopIndex((i) => Math.min(topShops.length - 1, i + 1));

  const renderListView = () => (
    <>
      {/* Top Rated Barbershops */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
            <Box>
              <Typography variant="h4" sx={{ fontFamily: "'Literata', serif" }}>Top Rated Barbershops</Typography>
              <Typography variant="body1" color="text.secondary">The highest-rated grooming experts in your area</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                onClick={handlePrevShop}
                disabled={shopIndex === 0}
                sx={{ border: '1px solid', borderColor: 'divider', color: 'text.primary', '&:disabled': { opacity: 0.3 } }}
              >
                <ChevronLeftIcon />
              </IconButton>
              <IconButton
                onClick={handleNextShop}
                disabled={shopIndex >= topShops.length - 1}
                sx={{ border: '1px solid', borderColor: 'divider', color: 'text.primary', '&:disabled': { opacity: 0.3 } }}
              >
                <ChevronRightIcon />
              </IconButton>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {topShops.map((shop) => (
              <Grid size={{ xs: 12, md: 4 }} key={shop.id}>
                <Card
                  sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)' } }}
                  onClick={() => navigate('/shops')}
                >
                  <Box
                    sx={{
                      height: 200,
                      bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(157, 211, 170, 0.03)' : 'rgba(74, 124, 89, 0.04)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                    }}
                  >
                    <StorefrontIcon sx={{ fontSize: 60, color: 'primary.main', opacity: 0.12 }} />
                    <Chip
                      icon={<StarIcon sx={{ fontSize: '14px !important', color: 'tertiary.main !important' }} />}
                      label={shop.rating}
                      size="small"
                      sx={{
                        position: 'absolute', top: 12, right: 12,
                        bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(11, 15, 12, 0.8)' : 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(8px)', fontWeight: 700,
                      }}
                    />
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontFamily: "'Literata', serif" }}>
                      {shop.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mb: 2 }}>
                      <LocationOnIcon sx={{ fontSize: 16 }} />
                      <Typography variant="body2">{shop.location} &bull; {shop.distance}</Typography>
                    </Box>
                    <Button variant="outlined" size="small" fullWidth>View Details</Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Popular Services */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          bgcolor: (t) => t.palette.mode === 'dark' ? '#0f1511' : '#f5f1ea',
          borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" sx={{ fontFamily: "'Literata', serif" }}>Popular Services</Typography>
            <Typography variant="body1" color="text.secondary">Expert care for your unique style</Typography>
          </Box>
          <Grid container spacing={2}>
            {popularServices.map((s) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={s.id}>
                <Card
                  sx={{ display: 'flex', alignItems: 'center', p: 2.5, cursor: 'pointer', '&:hover': { borderColor: 'primary.main' } }}
                  onClick={() => navigate('/booking')}
                >
                  <Box sx={{ p: 1.5, bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(157, 211, 170, 0.06)' : 'rgba(74, 124, 89, 0.06)', borderRadius: '12px', mr: 2.5, display: 'flex', color: 'primary.main' }}>
                    {s.icon}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" fontWeight={700} noWrap>{s.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{s.desc}</Typography>
                  </Box>
                  <Typography variant="subtitle1" fontWeight={700} color="primary.main" sx={{ ml: 1 }}>{s.price}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* App Download CTA */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              p: { xs: 4, md: 8 }, borderRadius: '32px',
              bgcolor: (t) => t.palette.mode === 'dark' ? '#2b5c3c' : 'primary.main',
              display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 6,
            }}
          >
            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h3" sx={{ color: '#fff', mb: 3, fontFamily: "'Literata', serif" }}>
                Take your style anywhere.
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', mb: 5, fontWeight: 400 }}>
                Download the Terra Barber app for instant bookings, stylist chat, and exclusive loyalty rewards.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Button variant="contained" sx={{ bgcolor: '#fff', color: (t) => t.palette.mode === 'dark' ? '#2b5c3c' : 'primary.main', fontWeight: 700, '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}>
                  App Store
                </Button>
                <Button variant="contained" sx={{ bgcolor: '#fff', color: (t) => t.palette.mode === 'dark' ? '#2b5c3c' : 'primary.main', fontWeight: 700, '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}>
                  Google Play
                </Button>
              </Box>
            </Box>
            <Box sx={{ width: { xs: '100%', md: 220 }, height: 220, bgcolor: 'rgba(255,255,255,0.08)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ContentCutIcon sx={{ fontSize: 60, color: 'rgba(255,255,255,0.2)' }} />
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      <HeroSearch viewMode={viewMode} onViewModeChange={setViewMode} />

      {/* Map View */}
      {viewMode === 'map' && (
        <Box sx={{ py: 4 }}>
          <Container maxWidth="lg">
            <MapView />
          </Container>
        </Box>
      )}

      {/* List View */}
      {viewMode === 'list' && renderListView()}

    </Box>
  );
}
