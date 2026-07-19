import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import FormLabel from '@mui/material/FormLabel';
import StarIcon from '@mui/icons-material/Star';

const priceSegments = ['$', '$$', '$$$', '$$$$'];
const ratingOptions = [4.5, 4.0, 3.5];
const distanceOptions = ['1 km', '10 km', '50 km'];

export default function FilterSidebar({ selectedPrice, setSelectedPrice, minRating, setMinRating }) {
  return (
    <Card sx={{ p: 3, position: { md: 'sticky' }, top: { md: 80 } }}>
      <Typography variant="h6" fontWeight={700} sx={{ fontFamily: "'Literata', serif", mb: 3 }}>
        Filters
      </Typography>

      {/* Price Range */}
      <FormLabel sx={{ fontWeight: 600, fontSize: '0.85rem', color: 'text.primary', mb: 1, display: 'block' }}>
        Price Range
      </FormLabel>
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        {priceSegments.map((p) => (
          <Chip
            key={p}
            label={p}
            size="small"
            onClick={() => setSelectedPrice(selectedPrice === p ? null : p)}
            sx={{
              cursor: 'pointer',
              bgcolor: selectedPrice === p ? 'primary.main' : 'transparent',
              color: selectedPrice === p ? 'primary.contrastText' : 'text.secondary',
              border: '1px solid',
              borderColor: selectedPrice === p ? 'primary.main' : 'divider',
              fontWeight: 600,
            }}
          />
        ))}
      </Box>

      {/* Rating */}
      <FormLabel sx={{ fontWeight: 600, fontSize: '0.85rem', color: 'text.primary', mb: 1, display: 'block' }}>
        Minimum Rating
      </FormLabel>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
        {ratingOptions.map((r) => (
          <Chip
            key={r}
            icon={<StarIcon sx={{ fontSize: '14px !important', color: minRating === r ? 'tertiary.main !important' : 'text.secondary !important' }} />}
            label={`${r}+ Stars`}
            size="small"
            onClick={() => setMinRating(minRating === r ? null : r)}
            sx={{
              cursor: 'pointer',
              bgcolor: minRating === r ? 'primary.main' : 'transparent',
              color: minRating === r ? 'primary.contrastText' : 'text.secondary',
              border: '1px solid',
              borderColor: minRating === r ? 'primary.main' : 'divider',
              fontWeight: 600,
              justifyContent: 'flex-start',
            }}
          />
        ))}
      </Box>

      {/* Distance */}
      <FormLabel sx={{ fontWeight: 600, fontSize: '0.85rem', color: 'text.primary', mb: 1, display: 'block' }}>
        Distance
      </FormLabel>
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        {distanceOptions.map((d) => (
          <Chip
            key={d}
            label={d}
            size="small"
            variant="outlined"
            sx={{ cursor: 'pointer', '&:hover': { borderColor: 'primary.main' } }}
          />
        ))}
      </Box>

      <Button fullWidth variant="contained" size="small" sx={{ mb: 1 }}>Apply Filters</Button>
      <Button fullWidth variant="text" size="small" color="inherit" onClick={() => { setSelectedPrice(null); setMinRating(null); }}>
        Reset All
      </Button>
    </Card>
  );
}
