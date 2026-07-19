import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import PublicIcon from '@mui/icons-material/Public';
import EmailIcon from '@mui/icons-material/Email';

const exploreLinks = [
  { label: 'Our Story', path: '/' },
  { label: 'Services', path: '/services' },
  { label: 'Meet the Barbers', path: '/barbers' },
  { label: 'Gift Cards', path: '/' },
];

const supportLinks = [
  { label: 'Partner with Us', path: '/' },
  { label: 'Help Center', path: '/' },
  { label: 'Privacy Policy', path: '/' },
  { label: 'Terms of Service', path: '/' },
];

const workingHours = [
  { day: 'Mon – Fri', hours: '09:00 – 20:00' },
  { day: 'Saturday', hours: '10:00 – 18:00' },
  { day: 'Sunday', hours: 'Closed' },
];

export default function TerraFooter() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: (t) => t.palette.mode === 'dark' ? '#0f1511' : '#f0ece4',
        borderTop: 1,
        borderColor: 'divider',
        mt: 'auto',
        pt: 8,
        pb: 4,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={5}>
          {/* Brand */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <ContentCutIcon sx={{ color: 'primary.main', fontSize: 20 }} />
              <Typography variant="h6" sx={{ fontFamily: "'Literata', serif", fontWeight: 700, color: 'primary.main' }}>
                Terra Barber
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 260, lineHeight: 1.8, mb: 3 }}>
              Redefining the modern grooming experience through organic aesthetics and master craftsmanship.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" sx={{ color: 'text.secondary', border: '1px solid', borderColor: 'divider', '&:hover': { color: 'primary.main' } }}>
                <PublicIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: 'text.secondary', border: '1px solid', borderColor: 'divider', '&:hover': { color: 'primary.main' } }}>
                <EmailIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Explore Links */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="subtitle2" fontWeight={700} color="text.primary" mb={2}>
              Explore
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
              {exploreLinks.map((link) => (
                <Typography
                  key={link.label}
                  component={Link}
                  to={link.path}
                  variant="body2"
                  color="text.secondary"
                  sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                >
                  {link.label}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* Working Hours */}
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="subtitle2" fontWeight={700} color="text.primary" mb={2}>
              Working Hours
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {workingHours.map((item) => (
                <Box key={item.day} sx={{ display: 'flex', justifyContent: 'space-between', maxWidth: 220 }}>
                  <Typography variant="body2" color="text.secondary">{item.day}</Typography>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color={item.hours === 'Closed' ? 'error.main' : 'text.primary'}
                  >
                    {item.hours}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Contact & Support */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" fontWeight={700} color="text.primary" mb={2}>
              Contact & Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
              <Typography variant="body2" color="text.secondary">122 Forest Hills Drive, Portland, OR 97201</Typography>
              <Typography variant="body2" color="text.secondary">(503) 555-0198</Typography>
              <Typography variant="body2" color="text.secondary">hello@terrabarber.com</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {supportLinks.map((link) => (
                <Typography
                  key={link.label}
                  component={Link}
                  to={link.path}
                  variant="caption"
                  color="text.secondary"
                  sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                >
                  {link.label}
                </Typography>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="caption" color="text.secondary">
            &copy; {new Date().getFullYear()} Terra Grooming. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
