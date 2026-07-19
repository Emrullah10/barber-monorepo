import {
  Box, Grid, TextField, Button, Alert, Card, CardContent, Typography, CircularProgress
} from '@mui/material';

export default function LocationStep({ form, onChange, error, loading, onBack, onSubmit }) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Typography variant="h6" fontWeight={700} mb={3}>Konum & İletişim</Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Şehir" value={form.tenantCity} onChange={onChange('tenantCity')} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField fullWidth label="Adres" value={form.tenantAddress} onChange={onChange('tenantAddress')} multiline rows={2} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth label="Enlem (Latitude)" type="number" value={form.tenantLatitude}
              onChange={onChange('tenantLatitude')} placeholder="örn: 41.0082" inputProps={{ step: 'any' }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth label="Boylam (Longitude)" type="number" value={form.tenantLongitude}
              onChange={onChange('tenantLongitude')} placeholder="örn: 28.9784" inputProps={{ step: 'any' }}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button variant="outlined" onClick={onBack} sx={{ textTransform: 'none' }}>
            Geri
          </Button>
          <Button
            variant="contained" onClick={onSubmit} disabled={loading}
            sx={{ textTransform: 'none', fontWeight: 700, px: 4 }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : 'Dükkanı Oluştur'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
