import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import { useShopDetail } from '@/features/shops/hooks/useShops';

export default function ShopDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { shop, isLoading, error } = useShopDetail(slug);

  const getAvatarColor = (id) => {
    const colors = ['#4a7c59', '#6b6358', '#705c30', '#3d7a6e', '#7a5c4a'];
    return colors[(id || 0) % colors.length];
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      <Box sx={{ py: { xs: 6, md: 10 }, flex: 1 }}>
        <Container maxWidth="lg">
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress color="primary" />
            </Box>
          )}

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          {!isLoading && !error && shop && (
            <>
              {/* Dukkan Bilgileri */}
              <Card sx={{ mb: 4, p: { xs: 3, md: 4 } }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, gap: 3 }}>
                  <Avatar
                    src={shop.tenantPhotoUrl || undefined}
                    sx={{ width: 100, height: 100, bgcolor: getAvatarColor(shop.tenantId), mx: { xs: 'auto', md: 0 } }}
                  >
                    <StorefrontIcon sx={{ fontSize: 48 }} />
                  </Avatar>

                  <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                    <Typography
                      variant="h3"
                      sx={{ fontFamily: "'Literata', serif", fontWeight: 700, color: 'text.primary', mb: 1 }}
                    >
                      {shop.tenantName}
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                      {shop.tenantCity && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationOnIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">{shop.tenantCity}</Typography>
                        </Box>
                      )}
                      {shop.tenantPhone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PhoneIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">{shop.tenantPhone}</Typography>
                        </Box>
                      )}
                      {shop.tenantEmail && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <EmailIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">{shop.tenantEmail}</Typography>
                        </Box>
                      )}
                    </Box>

                    {shop.tenantAddress && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {shop.tenantAddress}
                      </Typography>
                    )}
                  </Box>

                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate(`/shops/${slug}/booking`)}
                    sx={{ alignSelf: { md: 'center' }, minWidth: 160 }}
                  >
                    Randevu Al
                  </Button>
                </Box>
              </Card>

              {/* Berberler */}
              <Typography
                variant="h4"
                sx={{ fontFamily: "'Literata', serif", fontWeight: 700, color: 'text.primary', mb: 3 }}
              >
                Berberlerimiz
              </Typography>

              {(!shop.barbers || shop.barbers.length === 0) ? (
                <Alert severity="info">Bu dukkanda henuz berber bulunmuyor.</Alert>
              ) : (
                <Grid container spacing={3}>
                  {shop.barbers.map((barber) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={barber.usersId}>
                      <Card sx={{
                        height: '100%',
                        textAlign: 'center',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(46,50,48,0.12)' },
                      }}>
                        <CardContent sx={{ p: 3 }}>
                          <Avatar
                            src={barber.usersPhotoUrl || undefined}
                            sx={{
                              width: 72,
                              height: 72,
                              mx: 'auto',
                              mb: 2,
                              bgcolor: getAvatarColor(barber.usersId),
                              fontSize: '1.3rem',
                              fontWeight: 700,
                            }}
                          >
                            {barber.usersName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </Avatar>

                          <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{ fontFamily: "'Literata', serif", mb: 0.5 }}
                          >
                            {barber.usersName}
                          </Typography>

                          {barber.usersSpecialty && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                              {barber.usersSpecialty}
                            </Typography>
                          )}

                          <Chip
                            label={barber.roleInTenant === 'owner' ? 'Dukkan Sahibi' : 'Berber'}
                            size="small"
                            icon={<PersonIcon />}
                            sx={{
                              bgcolor: barber.roleInTenant === 'owner'
                                ? 'rgba(112, 92, 48, 0.1)'
                                : 'rgba(74, 124, 89, 0.1)',
                              color: barber.roleInTenant === 'owner' ? '#705c30' : 'primary.main',
                              fontWeight: 600,
                            }}
                          />

                          <Divider sx={{ my: 2 }} />

                          <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => navigate(`/shops/${slug}/booking?barberId=${barber.usersId}`)}
                          >
                            Bu Berberi Sec
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}
        </Container>
      </Box>

    </Box>
  );
}
