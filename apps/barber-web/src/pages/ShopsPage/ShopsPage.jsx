import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import { useShops } from '@/features/shops/hooks/useShops';

export default function ShopsPage() {
  const navigate = useNavigate();
  const { shops, isLoading, error } = useShops();

  const getAvatarColor = (id) => {
    const colors = ['#4a7c59', '#6b6358', '#705c30', '#3d7a6e', '#7a5c4a'];
    return colors[(id || 0) % colors.length];
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Sayfa Basligi */}
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 6, md: 8 }, borderBottom: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography
            variant="h2"
            sx={{ fontFamily: "'Literata', serif", fontWeight: 700, color: 'text.primary', mb: 2 }}
          >
            Dukkanlar
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 520, mx: 'auto' }}>
            Size en uygun berber dukkanini secin ve randevunuzu hemen olusturun.
          </Typography>
        </Container>
      </Box>

      {/* Dukkan Kartlari */}
      <Box sx={{ py: { xs: 6, md: 10 }, flex: 1 }}>
        <Container maxWidth="lg">
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress color="primary" />
            </Box>
          )}

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          {!isLoading && !error && shops.length === 0 && (
            <Alert severity="info">Henuz dukkan bulunamadi.</Alert>
          )}

          {!isLoading && !error && shops.length > 0 && (
            <Grid container spacing={3}>
              {shops.map((shop) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={shop.tenantId}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(46,50,48,0.12)' },
                    }}
                  >
                    <CardContent sx={{ flex: 1, p: 3.5 }}>
                      {/* Avatar */}
                      <Avatar
                        src={shop.tenantPhotoUrl || undefined}
                        sx={{
                          width: 80,
                          height: 80,
                          mx: 'auto',
                          mb: 2,
                          bgcolor: getAvatarColor(shop.tenantId),
                        }}
                      >
                        <StorefrontIcon sx={{ fontSize: 36 }} />
                      </Avatar>

                      {/* Isim */}
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        color="text.primary"
                        sx={{ fontFamily: "'Literata', serif", mb: 1, textAlign: 'center' }}
                      >
                        {shop.tenantName}
                      </Typography>

                      {/* Sehir */}
                      {shop.tenantCity && (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 1 }}>
                          <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {shop.tenantCity}
                          </Typography>
                        </Box>
                      )}

                      {/* Telefon */}
                      {shop.tenantPhone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 1 }}>
                          <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {shop.tenantPhone}
                          </Typography>
                        </Box>
                      )}

                      {/* Adres */}
                      {shop.tenantAddress && (
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
                          {shop.tenantAddress}
                        </Typography>
                      )}

                      <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Chip
                          label="Aktif"
                          size="small"
                          sx={{ bgcolor: 'rgba(74, 124, 89, 0.1)', color: 'primary.main', fontWeight: 600 }}
                        />
                      </Box>
                    </CardContent>

                    <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => navigate(`/shops/${shop.tenantSlug}`)}
                      >
                        Dukkani Gor
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

    </Box>
  );
}
