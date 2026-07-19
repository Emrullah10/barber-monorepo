import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function AddBarberDialog({ open, onClose, value, onChange, onAdd }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Berber Ekle</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Kullanici ID"
          type="number"
          fullWidth
          value={value}
          onChange={(e) => onChange(e.target.value)}
          helperText="Eklemek istediginiz berberin kullanici ID'sini girin."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Iptal</Button>
        <Button variant="contained" onClick={onAdd}>Ekle</Button>
      </DialogActions>
    </Dialog>
  );
}
