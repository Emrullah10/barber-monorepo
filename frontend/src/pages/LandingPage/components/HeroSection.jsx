import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import StarIcon from '@mui/icons-material/Star';
import ContentCutIcon from '@mui/icons-material/ContentCut';

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        pt: { xs: 8, md: 14 },
        pb: { xs: 10, md: 16 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <Chip
              label="ESTABLISHED 2018"
              size="small"
              sx={{
                bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(157, 211, 170, 0.1)' : 'rgba(74, 124, 89, 0.1)',
                color: 'primary.main',
                fontWeight: 700,
                mb: 3,
                letterSpacing: 1.5,
                fontSize: '0.7rem',
              }}
            />
            <Typography
              variant="h1"
              sx={{
                fontFamily: "'Literata', serif",
                fontSize: { xs: '2.5rem', md: '3.8rem' },
                lineHeight: 1.1,
                mb: 3,
                fontWeight: 700,
              }}
            >
              Grooming for the{' '}
              <Box component="span" sx={{ color: 'primary.main' }}>
                Modern Man
              </Box>
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 540, mb: 5, lineHeight: 1.7, fontWeight: 400 }}>
              Experience artisanal barbering where traditional craft meets contemporary style.
              Every detail, from our organic products to our master techniques, is designed for the modern gentleman.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button variant="contained" size="large" onClick={() => navigate('/booking')} sx={{ px: 4, py: 1.5 }}>
                Book Now
              </Button>
              <Button variant="outlined" size="large" onClick={() => navigate('/services')} sx={{ px: 4, py: 1.5 }}>
                View Services
              </Button>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                width: '100%',
                height: { xs: 300, md: 450 },
                borderRadius: '24px',
                bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(157, 211, 170, 0.03)' : 'rgba(74, 124, 89, 0.05)',
                border: '1px solid',
                borderColor: (t) => t.palette.mode === 'dark' ? 'rgba(66, 74, 67, 0.5)' : 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <ContentCutIcon sx={{ fontSize: 120, color: 'primary.main', opacity: 0.08 }} />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 24,
                  left: 24,
                  right: 24,
                  p: 2.5,
                  bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(11, 15, 12, 0.85)' : 'rgba(250, 246, 240, 0.9)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <StarIcon sx={{ color: 'tertiary.main' }} />
                <Box>
                  <Typography variant="body2" fontWeight={700}>Master Craftsmanship</Typography>
                  <Typography variant="caption" color="text.secondary">Since 2018 in Portland</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
