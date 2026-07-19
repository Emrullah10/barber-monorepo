import TextField from '@mui/material/TextField';

const SIZE_MAP = {
  xs: 'small',
  sm: 'small',
  md: 'medium',
  lg: 'medium',
};

export default function MuiTextInput({ size = 'md', variant = 'outlined', ...props }) {
  return <TextField variant={variant} size={SIZE_MAP[size] ?? 'medium'} fullWidth {...props} />;
}
