import { useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import { useServices } from '@/features/services/hooks/useServices';
import { useShopDetail } from '@/features/shops/hooks/useShops';
import useCreateAppointment from '@/features/appointments/hooks/useCreateAppointment';
import BookingHeader from './components/BookingHeader';
import DateTimeSelector from './components/DateTimeSelector';
import SuccessScreen from './components/SuccessScreen';

dayjs.locale('tr');

const PLACEHOLDER_PHOTOS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop&crop=face',
];

export default function BookingPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const preSelectedBarberId = searchParams.get('barberId');

  const { shop, isLoading: shopLoading, error: shopError } = useShopDetail(slug);
  const tenantId = shop?.tenantId;
  const { services, isLoading: servicesLoading } = useServices(tenantId);
  const barbers = useMemo(() => shop?.barbers ?? [], [shop]);
  const { createAppointment, isLoading: bookingLoading, error: bookingError, success } = useCreateAppointment();

  const [activeStep, setActiveStep] = useState(preSelectedBarberId ? 1 : 0);
  const [selectedBarberId, setSelectedBarberId] = useState(preSelectedBarberId);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const selectedService = services.find((s) => String(s.servicesId) === String(selectedServiceId));
  const selectedBarber = barbers.find((b) => String(b.usersId) === String(selectedBarberId));

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleConfirm = async () => {
    if (!selectedServiceId || !selectedDate || !selectedTime) return;
    const ok = await createAppointment({
      servicesId: selectedServiceId,
      appointmentDate: selectedDate.format('YYYY-MM-DD'),
      appointmentTime: selectedTime,
      barberId: selectedBarberId,
      tenantId,
    });
    if (ok) setActiveStep(4);
  };

  const getAvatarColor = (id) => {
    const colors = ['#4a7c59', '#6b6358', '#705c30', '#3d7a6e', '#7a5c4a'];
    return colors[(id || 0) % colors.length];
  };

  if (shopLoading) {
    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <CircularProgress color="primary" />
        </Box>
      </Box>
    );
  }

  if (shopError || (!shopLoading && !shop)) {
    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Container maxWidth="sm" sx={{ py: 10 }}>
          <Alert severity="error">{shopError || 'Dükkan bulunamadı.'}</Alert>
          <Button sx={{ mt: 2 }} onClick={() => navigate('/shops')}>Dükkanlara Dön</Button>
        </Container>
      </Box>
    );
  }

  return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        <BookingHeader
          shop={shop}
          activeStep={activeStep}
          onBack={() => navigate(`/shops/${slug}`)}
          getAvatarColor={getAvatarColor}
        />

        <Box sx={{ py: { xs: 4, md: 6 }, flex: 1 }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              {/* SOL — Step Content */}
              <Grid size={{ xs: 12, md: activeStep === 0 ? 12 : 8 }}>

                {/* STEP 0: Berber Seçimi — Stitch "Choose Your Artisan" */}
                {activeStep === 0 && (
                  <Box>
                    {barbers.length === 0 ? (
                      <Alert severity="info" sx={{ mb: 2 }}>Bu dükkanda henüz berber bulunmuyor.</Alert>
                    ) : (
                      <Grid container spacing={3}>
                        {barbers.map((b, idx) => {
                          const isSelected = String(selectedBarberId) === String(b.usersId);
                          const photoUrl = b.usersPhotoUrl || PLACEHOLDER_PHOTOS[idx % PLACEHOLDER_PHOTOS.length];
                          return (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={b.usersId}>
                              <Card
                                sx={{
                                  cursor: 'pointer',
                                  border: 2,
                                  borderColor: isSelected ? 'primary.main' : 'transparent',
                                  borderRadius: 4,
                                  overflow: 'hidden',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: (theme) => theme.shadows[8],
                                    borderColor: 'primary.light',
                                  },
                                }}
                                onClick={() => setSelectedBarberId(
                                  isSelected ? null : String(b.usersId)
                                )}
                              >
                                <CardMedia
                                  component="img"
                                  height="280"
                                  image={photoUrl}
                                  alt={b.usersName}
                                  sx={{ objectFit: 'cover' }}
                                />
                                <CardContent sx={{ p: 2.5 }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                                    <Typography
                                      variant="h6"
                                      sx={{ fontFamily: "'Literata', serif", fontWeight: 700, fontSize: '1.05rem' }}
                                    >
                                      {b.usersName}
                                    </Typography>
                                    <Chip
                                      icon={<StarIcon sx={{ fontSize: '14px !important', color: '#d4a853 !important' }} />}
                                      label="4.9"
                                      size="small"
                                      sx={{ fontWeight: 700, bgcolor: 'transparent', fontSize: '0.75rem' }}
                                    />
                                  </Box>
                                  {b.usersSpecialty && (
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                      {b.usersSpecialty}
                                    </Typography>
                                  )}
                                  {b.roleInTenant && (
                                    <Chip
                                      label={b.roleInTenant === 'manager_barber' ? 'Master Barber' : 'Barber'}
                                      size="small"
                                      sx={{
                                        bgcolor: 'action.hover',
                                        fontWeight: 600,
                                        fontSize: '0.7rem',
                                        mb: 1.5,
                                      }}
                                    />
                                  )}
                                  <Button
                                    variant={isSelected ? 'contained' : 'outlined'}
                                    fullWidth
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedBarberId(String(b.usersId));
                                      handleNext();
                                    }}
                                    sx={{
                                      mt: 1,
                                      borderRadius: 2,
                                      fontWeight: 700,
                                      textTransform: 'none',
                                    }}
                                  >
                                    {isSelected ? 'Selected' : 'Book Now'}
                                  </Button>
                                </CardContent>
                              </Card>
                            </Grid>
                          );
                        })}
                      </Grid>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 4 }}>
                      <Button
                        variant="text"
                        onClick={() => { setSelectedBarberId(null); handleNext(); }}
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                      >
                        Skip — Any available barber
                      </Button>
                      <Button
                        variant="contained"
                        disabled={!selectedBarberId}
                        onClick={handleNext}
                        sx={{ textTransform: 'none', fontWeight: 600, px: 4 }}
                      >
                        Continue
                      </Button>
                    </Box>
                  </Box>
                )}

                {/* STEP 1: Hizmet Seçimi */}
                {activeStep === 1 && (
                  <Card sx={{ borderRadius: 3 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ mb: 0.5, fontFamily: "'Literata', serif" }}>
                        Hizmet Seçin
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Almak istediğiniz hizmeti seçin.
                      </Typography>

                      {servicesLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                          <CircularProgress size={28} />
                        </Box>
                      ) : services.length === 0 ? (
                        <Alert severity="info">Bu dükkanda henüz hizmet tanımlanmamış.</Alert>
                      ) : (
                        <Grid container spacing={1.5}>
                          {services.map((s) => {
                            const isSelected = String(selectedServiceId) === String(s.servicesId);
                            return (
                              <Grid size={{ xs: 12, sm: 6 }} key={s.servicesId}>
                                <Box
                                  onClick={() => setSelectedServiceId(String(s.servicesId))}
                                  sx={{
                                    p: 2.5, borderRadius: 3, border: 2, cursor: 'pointer', transition: 'all 0.2s',
                                    borderColor: isSelected ? 'primary.main' : 'divider',
                                    bgcolor: isSelected ? 'action.selected' : 'background.default',
                                    '&:hover': { borderColor: 'primary.light', transform: 'translateY(-2px)' },
                                  }}
                                >
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Box>
                                      <Typography variant="body2" fontWeight={700} color="text.primary">
                                        {s.servicesName}
                                      </Typography>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                        <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                        <Typography variant="caption" color="text.secondary">
                                          {s.servicesDurationMin} dk
                                        </Typography>
                                      </Box>
                                    </Box>
                                    <Chip
                                      label={`${s.servicesPrice} TL`}
                                      size="small"
                                      sx={{
                                        bgcolor: isSelected ? 'primary.main' : 'action.hover',
                                        color: isSelected ? '#fff' : 'text.primary',
                                        fontWeight: 700, fontSize: '0.75rem',
                                      }}
                                    />
                                  </Box>
                                </Box>
                              </Grid>
                            );
                          })}
                        </Grid>
                      )}

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                        <Button variant="outlined" onClick={handleBack} sx={{ textTransform: 'none' }}>Geri</Button>
                        <Button variant="contained" disabled={!selectedServiceId} onClick={handleNext} sx={{ textTransform: 'none', fontWeight: 600 }}>
                          Devam Et
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                )}

                {/* STEP 2: Tarih & Saat — Stitch "Schedule Your Visit" */}
                {activeStep === 2 && (
                  <DateTimeSelector
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onDateChange={setSelectedDate}
                    onTimeChange={setSelectedTime}
                    onBack={handleBack}
                    onNext={handleNext}
                  />
                )}

                {/* STEP 3: Onay */}
                {activeStep === 3 && (
                  <Card sx={{ borderRadius: 3 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ mb: 3, fontFamily: "'Literata', serif" }}>
                        Randevu Özetiniz
                      </Typography>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
                          <StorefrontIcon sx={{ color: 'primary.main' }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>DÜKKAN</Typography>
                            <Typography variant="body2" fontWeight={700} color="text.primary">{shop.tenantName}</Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
                          <PersonIcon sx={{ color: 'primary.main' }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>BERBER</Typography>
                            <Typography variant="body2" fontWeight={700} color="text.primary">
                              {selectedBarber?.usersName || 'İlk uygun berber'}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
                          <ContentCutIcon sx={{ color: 'primary.main' }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>HİZMET</Typography>
                            <Typography variant="body2" fontWeight={700} color="text.primary">
                              {selectedService?.servicesName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {selectedService?.servicesDurationMin} dk
                            </Typography>
                          </Box>
                          <Typography variant="h6" fontWeight={700} color="primary.main" sx={{ fontFamily: "'Literata', serif" }}>
                            {selectedService?.servicesPrice} TL
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
                          <CalendarMonthIcon sx={{ color: 'primary.main' }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>TARİH & SAAT</Typography>
                            <Typography variant="body2" fontWeight={700} color="text.primary">
                              {selectedDate?.format('D MMMM YYYY, dddd')} — {selectedTime}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {bookingError && (
                        <Alert severity={bookingError.includes('yakında') ? 'info' : 'error'} sx={{ mt: 3, borderRadius: 2 }}>
                          {bookingError}
                        </Alert>
                      )}

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                        <Button variant="outlined" onClick={handleBack} sx={{ textTransform: 'none' }}>Geri</Button>
                        <Button
                          variant="contained"
                          size="large"
                          disabled={bookingLoading}
                          onClick={handleConfirm}
                          sx={{ px: 5, py: 1.5, textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                        >
                          {bookingLoading ? <CircularProgress size={22} color="inherit" /> : 'Confirm Appointment →'}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                )}

                {/* STEP 4: Başarı */}
                {activeStep === 4 && (
                  <SuccessScreen shop={shop} slug={slug} selectedService={selectedService} />
                )}
              </Grid>

              {/* SAĞ — Booking Summary Sidebar (Stitch tarzı) */}
              {activeStep > 0 && activeStep < 4 && (
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card sx={{ position: { md: 'sticky' }, top: 88, borderRadius: 3 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ mb: 3, fontFamily: "'Literata', serif" }}>
                        Booking Summary
                      </Typography>

                      {/* Hizmet */}
                      {selectedService && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                          <Box sx={{
                            width: 40, height: 40, borderRadius: 2, bgcolor: 'primary.main',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <ContentCutIcon sx={{ color: '#fff', fontSize: 18 }} />
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>SERVICE</Typography>
                            <Typography variant="body2" fontWeight={700} color="text.primary">
                              {selectedService.servicesName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {selectedService.servicesDurationMin} Minutes
                            </Typography>
                          </Box>
                        </Box>
                      )}

                      {/* Berber */}
                      {selectedBarber && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                          <Avatar
                            src={selectedBarber.usersPhotoUrl || undefined}
                            sx={{ width: 40, height: 40, bgcolor: getAvatarColor(selectedBarber.usersId) }}
                          >
                            {selectedBarber.usersName?.slice(0, 2).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>MASTER BARBER</Typography>
                            <Typography variant="body2" fontWeight={700} color="text.primary">
                              {selectedBarber.usersName}
                            </Typography>
                          </Box>
                        </Box>
                      )}

                      <Divider sx={{ my: 2 }} />

                      {/* Tarih & Saat */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">Date</Typography>
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {selectedDate ? selectedDate.format('D MMMM YYYY') : '—'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Time</Typography>
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {selectedTime || '—'}
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      {/* Fiyat */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">Total Price</Typography>
                        <Typography variant="h5" fontWeight={700} color="text.primary" sx={{ fontFamily: "'Literata', serif" }}>
                          {selectedService ? `${selectedService.servicesPrice} TL` : '—'}
                        </Typography>
                      </Box>

                      {/* Confirm butonu (sadece step 3'te değil, her zaman göster) */}
                      {activeStep === 3 && (
                        <Button
                          variant="contained"
                          fullWidth
                          size="large"
                          disabled={bookingLoading}
                          onClick={handleConfirm}
                          sx={{ mt: 3, py: 1.5, textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                        >
                          {bookingLoading ? <CircularProgress size={22} color="inherit" /> : 'Confirm Appointment →'}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Container>
        </Box>

      </Box>
  );
}
