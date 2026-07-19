import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

export default function HeroSearchBar({ searchTerm, onSearchChange }) {
  return (
    <Box sx={{ pt: { xs: 8, md: 12 }, pb: 8 }}>
      <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
        <Typography variant="h2" sx={{ fontFamily: "'Literata', serif", mb: 3 }}>Curated Grooming</Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 6, fontWeight: 400, maxWidth: 640, mx: 'auto' }}>
          Discover and book premium services from the finest artisanal barbers in your city.
        </Typography>
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'primary.main' }} /></InputAdornment>,
            }}
          />
        </Box>
      </Container>
    </Box>
  );
}
