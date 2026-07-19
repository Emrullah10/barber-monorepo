import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StorefrontIcon from '@mui/icons-material/Storefront';

const STEPS = ['Berber', 'Hizmet', 'Tarih & Saat', 'Onay'];

export default function BookingHeader({ shop, activeStep, onBack, getAvatarColor }) {
  return (
    <Box sx={{ bgcolor: 'background.paper', py: { xs: 4, md: 5 }, borderBottom: 1, borderColor: 'divider' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <IconButton onClick={onBack} sx={{ color: 'text.secondary' }}>
            <ArrowBackIcon />
          </IconButton>
          <Avatar
            src={shop.tenantPhotoUrl || undefined}
            sx={{ width: 48, height: 48, bgcolor: getAvatarColor(shop.tenantId) }}
          >
            <StorefrontIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontFamily: "'Literata', serif", fontWeight: 700, color: 'text.primary' }}>
              {activeStep === 0 ? 'Choose Your Artisan' : activeStep === 2 ? 'Schedule Your Visit' : 'Randevu Al'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {activeStep === 0
                ? `Select your preferred barber at ${shop.tenantName}.`
                : activeStep === 2
                  ? `Select your preferred date and time at ${shop.tenantName}.`
                  : shop.tenantName}
            </Typography>
          </Box>
        </Box>

        {activeStep < 4 && (
          <Stepper activeStep={activeStep} alternativeLabel sx={{
            '& .MuiStepLabel-label': { fontSize: '0.8rem', fontWeight: 600 },
            '& .MuiStepIcon-root.Mui-active': { color: 'primary.main' },
            '& .MuiStepIcon-root.Mui-completed': { color: 'primary.main' },
          }}>
            {STEPS.map((label) => (
              <Step key={label}><StepLabel>{label}</StepLabel></Step>
            ))}
          </Stepper>
        )}
      </Container>
    </Box>
  );
}
