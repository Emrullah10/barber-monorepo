import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import TerraNavbar from '@/components/TerraNavbar';
import TerraFooter from '@/components/TerraFooter';

export default function MainLayout() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TerraNavbar />
      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <TerraFooter />
    </Box>
  );
}
