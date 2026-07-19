import Button from '@mui/material/Button';

const SIZE_MAP = {
  xs: 'small',
  sm: 'small',
  md: 'medium',
  lg: 'large',
};

export default function MuiButton({ size = 'md', variant = 'contained', ...props }) {
  return <Button variant={variant} size={SIZE_MAP[size] ?? 'medium'} {...props} />;
}
