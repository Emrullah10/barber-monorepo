import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import TuneIcon from '@mui/icons-material/Tune';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import useBarbers from '@/features/dashboard/hooks/useBarbers';
import FilterSidebar from './components/FilterSidebar';

const ITEMS_PER_PAGE = 6;

const priceSegments = ['$', '$$', '$$$', '$$$$'];
const sortOptions = ['Most Recommended', 'Lowest Price', 'Distance'];

const serviceTags = [
  ['Fades', 'Beard Sculpt', 'Hot Towel'],
  ['Classic Cut', 'Grey Blending', 'Shave'],
  ['Modern Styles', 'Scalp Care', 'Fades'],
  ['Beard Sculpt', 'Hot Towel', 'Finishing'],
  ['Classic Cut', 'Fades', 'Shave'],
];

const studioNames = ['Iron & Taper Studio', 'Heritage Cuts', 'Urban Botanist', 'The Woodhouse', 'Verdant Grooming'];

export default function BarbersPage() {
  const navigate = useNavigate();
  const { barbers, isLoading, error } = useBarbers();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [activeSort, setActiveSort] = useState('Most Recommended');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [minRating, setMinRating] = useState(null);

  const featuredArtisans = barbers.slice(0, 4);

  const filteredBarbers = useMemo(() => {
    return barbers.filter((b) =>
      b.usersName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [barbers, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredBarbers.length / ITEMS_PER_PAGE));
  const paginatedBarbers = filteredBarbers.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const getInitial = (name = '') => name.charAt(0).toUpperCase();
  const getRating = (idx) => (4.5 + (idx % 6) * 0.1).toFixed(1);
  const getReviews = (idx) => 30 + (idx * 17) % 200;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Featured Artisans Spotlight */}
      <Box sx={{ pt: { xs: 8, md: 12 }, pb: 8, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontFamily: "'Literata', serif", mb: 6, textAlign: { xs: 'center', md: 'left' } }}>
            Featured Artisans
          </Typography>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress color="primary" /></Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <Grid container spacing={4}>
              {featuredArtisans.map((barber, idx) => (
                <Grid size={{ xs: 6, sm: 3 }} key={barber.usersId}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: '100%',
                        maxWidth: 180,
                        mx: 'auto',
                        aspectRatio: '1',
                        mb: 2.5,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(157, 211, 170, 0.04)' : 'rgba(74, 124, 89, 0.04)',
                        border: '2px solid',
                        borderColor: 'divider',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: 'primary.main',
                          transform: 'translateY(-4px)',
                          boxShadow: (t) => t.palette.mode === 'dark' ? '0 8px 24px rgba(157, 211, 170, 0.12)' : '0 8px 24px rgba(0,0,0,0.08)',
                        },
                      }}
                      onClick={() => barber.tenantSlug ? navigate(`/shops/${barber.tenantSlug}/booking?barberId=${barber.usersId}`) : null}
                    >
                      <Avatar sx={{ width: '100%', height: '100%', bgcolor: 'transparent', fontSize: '2.5rem', color: 'primary.main', fontWeight: 700 }}>
                        {getInitial(barber.usersName)}
                      </Avatar>
                    </Box>
                    <Typography variant="h6" fontWeight={700} sx={{ fontFamily: "'Literata', serif" }}>{barber.usersName}</Typography>
                    <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {barber.tenantName || studioNames[idx % studioNames.length]}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      <StarIcon sx={{ fontSize: 14, color: 'tertiary.main' }} />
                      <Typography variant="caption" fontWeight={700}>{getRating(idx)}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        &bull; {priceSegments[idx % priceSegments.length]}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      {/* Search & Results */}
      <Box sx={{ py: 8, flex: 1 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Sidebar Filters */}
            <Grid size={{ xs: 12, md: 3 }} sx={{ display: { xs: showFilters ? 'block' : 'none', md: 'block' } }}>
              <FilterSidebar
                selectedPrice={selectedPrice}
                setSelectedPrice={setSelectedPrice}
                minRating={minRating}
                setMinRating={setMinRating}
              />
            </Grid>

            {/* Results Area */}
            <Grid size={{ xs: 12, md: 9 }}>
              {/* Header with Search + Sort */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center', mb: 5, justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontFamily: "'Literata', serif" }}>
                    {filteredBarbers.length} Results Found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Handpicked barbers in your neighborhood
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <TextField
                    size="small"
                    placeholder="Search barbers..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20 }} /></InputAdornment>,
                    }}
                    sx={{ width: { xs: '100%', sm: 240 } }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<TuneIcon />}
                    onClick={() => setShowFilters(!showFilters)}
                    sx={{ display: { md: 'none' }, px: 3 }}
                  >
                    Filters
                  </Button>
                </Box>
              </Box>

              {/* Sort Chips */}
              <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
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

              {/* Barber Cards */}
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress color="primary" /></Box>
              ) : error ? (
                <Alert severity="error">{error}</Alert>
              ) : filteredBarbers.length === 0 ? (
                <Alert severity="info">No barbers found matching your search.</Alert>
              ) : (
                <>
                  <Grid container spacing={3}>
                    {paginatedBarbers.map((barber, idx) => {
                      const globalIdx = (page - 1) * ITEMS_PER_PAGE + idx;
                      return (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={barber.usersId}>
                          <Card
                            sx={{
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              cursor: 'pointer',
                              '&:hover': { transform: 'translateY(-4px)' },
                            }}
                            onClick={() => barber.tenantSlug ? navigate(`/shops/${barber.tenantSlug}/booking?barberId=${barber.usersId}`) : null}
                          >
                            {/* Photo area */}
                            <Box
                              sx={{
                                height: 180,
                                bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(157, 211, 170, 0.03)' : 'rgba(74, 124, 89, 0.04)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Avatar sx={{ width: 80, height: 80, bgcolor: 'transparent', color: 'primary.main', fontSize: '2rem', fontWeight: 700 }}>
                                {getInitial(barber.usersName)}
                              </Avatar>
                            </Box>
                            <CardContent sx={{ flex: 1, p: 3 }}>
                              <Typography variant="subtitle1" fontWeight={700} sx={{ fontFamily: "'Literata', serif" }}>
                                {barber.usersName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                {barber.tenantName || studioNames[globalIdx % studioNames.length]}
                              </Typography>

                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                <StarIcon sx={{ fontSize: 14, color: 'tertiary.main' }} />
                                <Typography variant="body2" fontWeight={700}>{getRating(globalIdx)}</Typography>
                                <Typography variant="caption" color="text.secondary">({getReviews(globalIdx)})</Typography>
                                <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.3, color: 'text.secondary' }}>
                                  <LocationOnIcon sx={{ fontSize: 14 }} />
                                  <Typography variant="caption">{(0.5 + globalIdx * 0.7).toFixed(1)} mi</Typography>
                                </Box>
                              </Box>

                              {/* Service Tags */}
                              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                {serviceTags[globalIdx % serviceTags.length].map((tag) => (
                                  <Chip
                                    key={tag}
                                    label={tag}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: '0.7rem', borderColor: 'divider', color: 'text.secondary' }}
                                  />
                                ))}
                              </Box>
                            </CardContent>
                            <Box sx={{ px: 3, pb: 3 }}>
                              <Button fullWidth variant="outlined" onClick={(e) => { e.stopPropagation(); if (barber.tenantSlug) navigate(`/shops/${barber.tenantSlug}/booking?barberId=${barber.usersId}`); }}>
                                View Profile
                              </Button>
                            </Box>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                      <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, v) => setPage(v)}
                        color="primary"
                        shape="rounded"
                        sx={{
                          '& .MuiPaginationItem-root': {
                            fontWeight: 600,
                            borderRadius: '8px',
                          },
                        }}
                      />
                    </Box>
                  )}
                </>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>

    </Box>
  );
}
