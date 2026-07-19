import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import ViewListIcon from '@mui/icons-material/ViewList';
import MapIcon from '@mui/icons-material/Map';

export default function HeroSearch({ viewMode, onViewModeChange }) {
  return (
    <Box sx={{ pt: { xs: 8, md: 14 }, pb: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
        <Typography variant="h2" sx={{ fontFamily: "'Literata', serif", mb: 3 }}>
          Rooted in Style
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 6, fontWeight: 400, maxWidth: 600, mx: 'auto' }}>
          Premium grooming tailored to your schedule. Find and book the finest barbers in your neighborhood.
        </Typography>

        {/* 3-Part Search Bar */}
        <Box
          sx={{
            maxWidth: 780, mx: 'auto', bgcolor: 'background.paper', borderRadius: '16px',
            border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', overflow: 'hidden',
            boxShadow: (t) => t.palette.mode === 'dark' ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.05)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, px: 2, borderRight: '1px solid', borderColor: 'divider' }}>
            <LocationOnIcon sx={{ color: 'primary.main', mr: 1 }} />
            <InputBase placeholder="Location..." sx={{ flex: 1, py: 2 }} />
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', flex: 1, px: 2, borderRight: '1px solid', borderColor: 'divider' }}>
            <ContentCutIcon sx={{ color: 'primary.main', mr: 1, fontSize: 20 }} />
            <InputBase placeholder="Service type..." sx={{ flex: 1, py: 2 }} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, px: 2 }}>
            <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
            <InputBase placeholder="Search..." sx={{ flex: 1, py: 2 }} />
          </Box>
          <Button variant="contained" size="large" sx={{ m: 1, px: 4, borderRadius: '12px' }}>
            Search
          </Button>
        </Box>

        {/* View Toggle */}
        <Box sx={{ mt: 4 }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, v) => v && onViewModeChange(v)}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                border: '1px solid', borderColor: 'divider', color: 'text.secondary', px: 3,
                '&.Mui-selected': { bgcolor: 'primary.main', color: 'primary.contrastText', borderColor: 'primary.main' },
              },
            }}
          >
            <ToggleButton value="list"><ViewListIcon sx={{ mr: 1, fontSize: 18 }} /> List View</ToggleButton>
            <ToggleButton value="map"><MapIcon sx={{ mr: 1, fontSize: 18 }} /> Map View</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Container>
    </Box>
  );
}
