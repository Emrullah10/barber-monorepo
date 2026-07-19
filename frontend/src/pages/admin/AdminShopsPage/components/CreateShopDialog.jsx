import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';

export default function CreateShopDialog({ open, onClose, form, onChange, formError, saving, onCreate }) {
  const generateSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleNameChange = (e) => {
    onChange('tenantName')(e);
    onChange('tenantSlug')({ target: { value: generateSlug(e.target.value) } });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Yeni Dukkan Olustur</DialogTitle>
      <DialogContent>
        {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
        <TextField
          autoFocus
          margin="dense"
          label="Dukkan Adi"
          fullWidth
          value={form.tenantName}
          onChange={handleNameChange}
        />
        <TextField margin="dense" label="Slug" fullWidth value={form.tenantSlug} onChange={onChange('tenantSlug')} />
        <TextField margin="dense" label="Sehir" fullWidth value={form.tenantCity} onChange={onChange('tenantCity')} />
        <TextField margin="dense" label="Sahip Kullanici ID (opsiyonel)" type="number" fullWidth value={form.ownerUserId} onChange={onChange('ownerUserId')} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Iptal</Button>
        <Button variant="contained" onClick={onCreate} disabled={saving}>
          {saving ? 'Olusturuluyor...' : 'Olustur'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
