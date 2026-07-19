import {
  Box, Grid, TextField, Button, Alert, Card, CardContent, Typography
} from '@mui/material';

export default function ShopInfoStep({ form, onChange, onSlugChange, error, onNext }) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Typography variant="h6" fontWeight={700} mb={3}>Dükkan Bilgileri</Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth label="Dükkan Adı" value={form.tenantName}
              onChange={onChange('tenantName')} required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth label="URL Slug" value={form.tenantSlug}
              onChange={onSlugChange}
              helperText={form.tenantSlug ? `terrabarber.com/shops/${form.tenantSlug}` : ''}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Telefon" value={form.tenantPhone} onChange={onChange('tenantPhone')} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="E-posta" value={form.tenantEmail} onChange={onChange('tenantEmail')} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField fullWidth label="Fotoğraf URL" value={form.tenantPhotoUrl} onChange={onChange('tenantPhotoUrl')} />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            variant="contained"
            onClick={onNext}
            sx={{ textTransform: 'none', fontWeight: 600, px: 4 }}
          >
            Devam Et
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
