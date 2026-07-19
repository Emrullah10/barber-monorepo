import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useServices } from '@/features/services/hooks/useServices';
import HeroSearchBar from './components/HeroSearchBar';

const categorize = (name = '') => {
  const lower = name.toLowerCase();
  if (lower.includes('sakal') || lower.includes('tıraş') || lower.includes('beard') || lower.includes('shave')) return 'sakal';
  if (lower.includes('spa') || lower.includes('bakım') || lower.includes('scalp') || lower.includes('detox')) return 'spa';
  return 'sac';
};

const categories = [
  { value: 'hepsi', label: 'All Services', icon: null },
  { value: 'sac', label: 'Hair Artistry', icon: <ContentCutIcon fontSize="small" /> },
  { value: 'sakal', label: 'Beard & Moustache', icon: <FaceRetouchingNaturalIcon fontSize="small" /> },
  { value: 'spa', label: 'Terra Spa', icon: <SpaOutlinedIcon fontSize="small" /> },
];

const trendingServices = [
  { name: 'Heritage Hot Towel Shave', price: 45, duration: 45, label: 'TRENDING NOW' },
  { name: 'Precision Mid-Fade', price: 35, duration: 30, label: 'POPULAR' },
  { name: 'Botanical Scalp Therapy', price: 60, duration: 50, label: 'RELAXATION' },
  { name: 'Beard Sculpt & Shape', price: 25, duration: 20, label: 'ESSENTIAL' },
];

const featuredSalons = [
  { name: 'The Green Room', location: 'Downtown', rating: 4.9, reviews: 128, services: [{ name: 'Classic Cut', price: 40 }, { name: 'Beard Trim', price: 25 }] },
  { name: 'Heritage Barbers', location: 'West End', rating: 4.7, reviews: 254, services: [{ name: 'Fade Cut', price: 35 }, { name: 'Hot Shave', price: 20 }] },
  { name: 'Nomad Grooming', location: 'Northside', rating: 5.0, reviews: 89, services: [{ name: 'Scissor Cut', price: 30 }, { name: 'Scalp Care', price: 15 }] },
];

const sortOptions = ['Nearby', 'Top Rated', 'Price: Low-High'];

export default function ServicesPage() {
  const navigate = useNavigate();
  const { services, isLoading, error } = useServices();
  const [activeTab, setActiveTab] = useState('hepsi');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSort, setActiveSort] = useState('Nearby');
  const [trendIdx, setTrendIdx] = useState(0);

  const filtered = services.filter((s) => {
    const matchesTab = activeTab === 'hepsi' || categorize(s.servicesName) === activeTab;
    const matchesSearch = s.servicesName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getCategoryIcon = (name) => {
    const cat = categorize(name);
    if (cat === 'sakal') return <FaceRetouchingNaturalIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.15 }} />;
    if (cat === 'spa') return <SpaOutlinedIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.15 }} />;
    return <ContentCutIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.15 }} />;
  };

  const getLabelColor = (label) => {
    if (label === 'TRENDING NOW') return 'error.main';
    if (label === 'POPULAR') return 'primary.main';
    if (label === 'RELAXATION') return 'tertiary.main';
    return 'secondary.main';
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      <HeroSearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {/* Trending Services Carousel */}
      <Box
        sx={{
          py: 8,
          bgcolor: (t) => t.palette.mode === 'dark' ? '#0f1511' : '#f5f1ea',
          borderTop: '1px solid',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontFamily: "'Literata', serif" }}>Trending Now</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                onClick={() => setTrendIdx((i) => Math.max(0, i - 1))}
                disabled={trendIdx === 0}
                sx={{ border: '1px solid', borderColor: 'divider', '&:disabled': { opacity: 0.3 } }}
              >
                <ChevronLeftIcon />
              </IconButton>
              <IconButton
                onClick={() => setTrendIdx((i) => Math.min(trendingServices.length - 1, i + 1))}
                disabled={trendIdx >= trendingServices.length - 1}
                sx={{ border: '1px solid', borderColor: 'divider', '&:disabled': { opacity: 0.3 } }}
              >
                <ChevronRightIcon />
              </IconButton>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {trendingServices.map((ts) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={ts.name}>
                <Card
                  sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)' } }}
                  onClick={() => navigate('/discover')}
                >
                  <Box
                    sx={{
                      height: 160,
                      bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(157, 211, 170, 0.03)' : 'rgba(74, 124, 89, 0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    <ContentCutIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.1 }} />
                    <Chip
                      label={ts.label}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        bgcolor: getLabelColor(ts.label),
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: '0.6rem',
                        letterSpacing: 0.5,
                      }}
                    />
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ fontFamily: "'Literata', serif", mb: 1 }}>
                      {ts.name}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="primary.main" fontWeight={700}>
                        Starts at ${ts.price}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                        <CalendarTodayIcon sx={{ fontSize: 14 }} />
                        <Typography variant="caption">{ts.duration} min</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Categories Navigation */}
      <Box sx={{ bgcolor: 'background.paper', position: 'sticky', top: 0, zIndex: 10, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ py: 1, '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' } }}
          >
            {categories.map((cat) => (
              <Tab key={cat.value} value={cat.value} label={cat.label} icon={cat.icon} iconPosition="start" sx={{ fontSize: '0.95rem', px: 4 }} />
            ))}
          </Tabs>
        </Container>
      </Box>

      {/* Services Grid */}
      <Box sx={{ py: 8, flex: 1 }}>
        <Container maxWidth="lg">
          {/* Sort Bar */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
            <Box>
              <Typography variant="h5" sx={{ fontFamily: "'Literata', serif" }}>
                {activeTab === 'hepsi' ? 'All Artisan Services' : categories.find((c) => c.value === activeTab)?.label}
              </Typography>
              <Typography variant="body2" color="text.secondary">{filtered.length} services found</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {sortOptions.map((opt) => (
                <Chip
                  key={opt}
                  label={opt}
                  size="small"
                  onClick={() => setActiveSort(opt)}
                  sx={{
                    cursor: 'pointer',
                    bgcolor: activeSort === opt ? 'primary.main' : 'transparent',
                    color: activeSort === opt ? 'primary.contrastText' : 'text.secondary',
                    border: '1px solid',
                    borderColor: activeSort === opt ? 'primary.main' : 'divider',
                    fontWeight: 600,
                  }}
                />
              ))}
            </Box>
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <Grid container spacing={3}>
              {filtered.map((service) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={service.servicesId}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      '&:hover': { transform: 'translateY(-4px)' },
                    }}
                    onClick={() => service.tenantSlug ? navigate(`/shops/${service.tenantSlug}/booking`) : navigate('/discover')}
                  >
                    <Box
                      sx={{
                        height: 140,
                        bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(157, 211, 170, 0.03)' : 'rgba(74, 124, 89, 0.04)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {getCategoryIcon(service.servicesName)}
                    </Box>
                    <CardContent sx={{ flex: 1, p: 3 }}>
                      <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontFamily: "'Literata', serif" }}>
                        {service.servicesName}
                      </Typography>
                      {service.tenantName && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {service.tenantName}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        <Chip label={`₺${service.servicesPrice}`} size="small" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 700 }} />
                        <Chip
                          icon={<AccessTimeIcon sx={{ fontSize: '14px !important' }} />}
                          label={`${service.servicesDurationMin} dk`}
                          size="small"
                          variant="outlined"
                          sx={{ borderColor: 'divider', color: 'text.secondary' }}
                        />
                      </Box>
                    </CardContent>
                    <Box sx={{ px: 3, pb: 3 }}>
                      <Button fullWidth variant="contained" onClick={(e) => { e.stopPropagation(); service.tenantSlug ? navigate(`/shops/${service.tenantSlug}/booking`) : navigate('/discover'); }}>
                        Book Now
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      {/* Featured Artisans / Salons */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          bgcolor: (t) => t.palette.mode === 'dark' ? '#0f1511' : '#f5f1ea',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontFamily: "'Literata', serif", mb: 2 }}>Featured Artisans</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
            Book directly from top-rated studios in your area
          </Typography>

          <Grid container spacing={3}>
            {featuredSalons.map((salon) => (
              <Grid size={{ xs: 12, md: 4 }} key={salon.name}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box
                    sx={{
                      height: 160,
                      bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(157, 211, 170, 0.03)' : 'rgba(74, 124, 89, 0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ContentCutIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.1 }} />
                  </Box>
                  <CardContent sx={{ flex: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <StarIcon sx={{ fontSize: 16, color: 'tertiary.main' }} />
                      <Typography variant="body2" fontWeight={700}>{salon.rating}</Typography>
                      <Typography variant="caption" color="text.secondary">({salon.reviews} reviews)</Typography>
                    </Box>
                    <Typography variant="h6" fontWeight={700} sx={{ fontFamily: "'Literata', serif", mb: 0.5 }}>
                      {salon.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', mb: 2 }}>
                      <LocationOnIcon sx={{ fontSize: 14 }} />
                      <Typography variant="caption">{salon.location}</Typography>
                    </Box>

                    {salon.services.map((sv) => (
                      <Box key={sv.name} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8, borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="body2">{sv.name}</Typography>
                        <Typography variant="body2" fontWeight={700} color="primary.main">${sv.price}</Typography>
                      </Box>
                    ))}
                  </CardContent>
                  <Box sx={{ px: 3, pb: 3 }}>
                    <Button fullWidth variant="contained" onClick={() => navigate('/discover')}>
                      Book Appointment
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

    </Box>
  );
}
