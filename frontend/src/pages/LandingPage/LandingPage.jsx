import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import StarIcon from '@mui/icons-material/Star';
import HeroSection from './components/HeroSection';
import ServicesShowcase from './components/ServicesShowcase';

const testimonials = [
  {
    name: 'Julian Marcus',
    role: 'Regular since 2019',
    comment: 'The atmosphere here is unlike any other shop. It\'s grounded, quiet, and professional. I never feel rushed, and the attention to detail is just incredible.',
    rating: 5,
  },
  {
    name: 'David Chen',
    role: 'Entrepreneur',
    comment: 'Terra is more than just a haircut; it\'s a reset. The earthy tones and the artisan approach make it the highlight of my month.',
    rating: 5,
  },
  {
    name: 'Marcus Thorne',
    role: 'Loyal client since 2020',
    comment: 'From the hot towel shave to the scalp massage, every detail is thoughtfully crafted. Terra truly understands modern grooming.',
    rating: 5,
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: 'text.primary' }}>

      <HeroSection />

      <ServicesShowcase />

      {/* Testimonials */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: (t) => t.palette.mode === 'dark' ? '#0f1511' : '#f5f1ea',
          borderTop: '1px solid',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontFamily: "'Literata', serif", textAlign: 'center', mb: 2 }}>
            What our clients say
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 8 }}>
            about the Terra experience
          </Typography>

          <Grid container spacing={3}>
            {testimonials.map((t) => (
              <Grid size={{ xs: 12, md: 4 }} key={t.name}>
                <Card sx={{ height: '100%', p: 1 }}>
                  <CardContent sx={{ p: 3 }}>
                    <FormatQuoteIcon sx={{ color: 'primary.main', opacity: 0.3, fontSize: 32, mb: 1 }} />
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontStyle: 'italic', lineHeight: 1.7 }}>
                      "{t.comment}"
                    </Typography>
                    <Box sx={{ display: 'flex', mb: 1.5, gap: 0.3 }}>
                      {[...Array(t.rating)].map((_, i) => (
                        <StarIcon key={i} sx={{ color: 'tertiary.main', fontSize: 16 }} />
                      ))}
                    </Box>
                    <Typography variant="subtitle2" fontWeight={700}>{t.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{t.role}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Stats Block */}
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
              <PeopleOutlineIcon sx={{ color: 'primary.main', fontSize: 28 }} />
              <Typography variant="h3" sx={{ fontFamily: "'Literata', serif", color: 'primary.main' }}>
                5,000+
              </Typography>
            </Box>
            <Typography variant="h6" color="text.secondary" fontWeight={400}>
              Satisfied Gents
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* CTA Banner */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md">
          <Box
            sx={{
              textAlign: 'center',
              p: { xs: 4, md: 8 },
              borderRadius: '24px',
              bgcolor: (t) => t.palette.mode === 'dark' ? '#2b5c3c' : 'primary.main',
            }}
          >
            <Typography
              variant="h3"
              sx={{ fontFamily: "'Literata', serif", fontWeight: 700, color: '#fff', mb: 2 }}
            >
              Ready for your transformation?
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 5, maxWidth: 480, mx: 'auto' }}>
              We recommend booking at least 48 hours in advance for the best availability.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/booking')}
                sx={{
                  bgcolor: '#fff',
                  color: (t) => t.palette.mode === 'dark' ? '#2b5c3c' : 'primary.main',
                  px: 5,
                  fontWeight: 700,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                }}
              >
                Book Appointment
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/services')}
                sx={{
                  borderColor: 'rgba(255,255,255,0.5)',
                  color: '#fff',
                  px: 5,
                  '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' },
                }}
              >
                View Schedule
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

    </Box>
  );
}
