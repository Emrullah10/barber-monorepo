import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';

export default function AuthLayout() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Outlet />
    </Box>
  );
}
