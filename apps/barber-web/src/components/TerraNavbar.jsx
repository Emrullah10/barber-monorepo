import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import StorefrontIcon from '@mui/icons-material/Storefront';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LanguageIcon from '@mui/icons-material/Language';
import { useAuthStore } from '@/store/authStore';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { useThemeMode } from '@/theme/ThemeContext';

const publicLinks = [
  { key: 'home', path: '/' },
  { key: 'explore', path: '/discover' },
  { key: 'services', path: '/services' },
  { key: 'barbers', path: '/barbers' },
  { key: 'shops', path: '/shops' },
];

export default function TerraNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { isLoggedIn, user, logoutAction } = useAuthStore();
  const { isAnyBarber, isAdmin, isManagerBarber, getDefaultPath } = useRoleGuard();
  const { mode, toggleTheme } = useThemeMode();
  const [anchorEl, setAnchorEl] = useState(null);
  const [langMenuAnchor, setLangMenuAnchor] = useState(null);

  const navLinks = [
    ...publicLinks,
    ...(isLoggedIn && !isAnyBarber() ? [{ key: 'myAppointments', path: '/my-appointments' }] : []),
    ...(isLoggedIn && !isAnyBarber() ? [{ key: 'bookAppointment', path: '/booking' }] : []),
    ...(isAnyBarber() ? [
      { key: 'panel', path: '/barber/dashboard' },
      { key: 'appointments', path: '/barber/appointments' },
      { key: 'reports', path: '/barber/reports' },
    ] : []),
    ...((isManagerBarber() || isAdmin()) ? [
      { key: 'shopSettings', path: '/barber/shop-settings' },
      { key: 'shopBarbers', path: '/barber/shop-barbers' },
    ] : []),
    ...(isAdmin() ? [
      { key: 'users', path: '/admin/users' },
      { key: 'allShops', path: '/admin/shops' },
    ] : []),
  ];

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLangMenuOpen = (e) => setLangMenuAnchor(e.currentTarget);
  const handleLangMenuClose = () => setLangMenuAnchor(null);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    handleLangMenuClose();
  };

  const handleLogout = () => {
    handleMenuClose();
    logoutAction();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', h: 80 }}>
          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 1.5 }}
          >
            <ContentCutIcon sx={{ color: 'primary.main', fontSize: 26 }} />
            <Typography
              variant="h5"
              sx={{
                fontFamily: "'Literata', serif",
                fontWeight: 700,
                color: 'text.primary',
                letterSpacing: '-0.5px',
              }}
            >
              TERRA
            </Typography>
          </Box>

          {/* Nav Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Button
                  key={link.path}
                  component={Link}
                  to={link.path}
                  sx={{
                    color: isActive ? 'primary.main' : 'text.primary',
                    fontWeight: isActive ? 700 : 500,
                    px: 2,
                    '&:hover': { bgcolor: 'rgba(142, 207, 158, 0.08)', color: 'primary.main' },
                  }}
                >
                  {t(`navbar.${link.key}`)}
                </Button>
              );
            })}
          </Box>

          {/* Right Side */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
              <IconButton onClick={toggleTheme} size="small" sx={{ color: 'text.secondary' }}>
                {mode === 'dark' ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
              </IconButton>
            </Tooltip>

            {/* Language Switcher */}
            <Tooltip title={t('navbar.switchTheme')}>
              <IconButton onClick={handleLangMenuOpen} size="small" sx={{ color: 'text.secondary' }}>
                <LanguageIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={langMenuAnchor}
              open={Boolean(langMenuAnchor)}
              onClose={handleLangMenuClose}
              PaperProps={{
                sx: { mt: 1, minWidth: 120, borderRadius: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' },
              }}
            >
              <MenuItem
                onClick={() => changeLanguage('tr')}
                selected={i18n.language === 'tr'}
                sx={{ py: 1.5 }}
              >
                {t('languages.turkish')}
              </MenuItem>
              <MenuItem
                onClick={() => changeLanguage('en')}
                selected={i18n.language === 'en'}
                sx={{ py: 1.5 }}
              >
                {t('languages.english')}
              </MenuItem>
            </Menu>

            {isLoggedIn ? (
              <>
                <IconButton size="small" sx={{ color: 'text.secondary' }}>
                  <FavoriteBorderIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" sx={{ color: 'text.secondary' }}>
                  <NotificationsOutlinedIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={handleMenuOpen} size="small" sx={{ color: 'text.secondary', ml: 0.5 }}>
                  <AccountCircleOutlinedIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: { mt: 1, minWidth: 200, borderRadius: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' },
                  }}
                >
                  <Box sx={{ px: 2.5, py: 2 }}>
                    <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                      {user?.usersName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                      {user?.usersRole}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem
                    onClick={() => { handleMenuClose(); navigate(getDefaultPath()); }}
                    sx={{ gap: 1.5, py: 1.5 }}
                  >
                    <CalendarMonthIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {isAnyBarber() ? t('navbar.barberPanel') : t('navbar.myAppointments')}
                    </Typography>
                  </MenuItem>
                  {isAnyBarber() && (
                    <MenuItem
                      onClick={() => { handleMenuClose(); navigate('/barber/profile'); }}
                      sx={{ gap: 1.5, py: 1.5 }}
                    >
                      <AccountCircleOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      <Typography variant="body2">{t('navbar.myProfile')}</Typography>
                    </MenuItem>
                  )}
                  {isLoggedIn && !user?.tenantId && !isAdmin() && (
                    <MenuItem
                      onClick={() => { handleMenuClose(); navigate('/create-shop'); }}
                      sx={{ gap: 1.5, py: 1.5 }}
                    >
                      <StorefrontIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      <Typography variant="body2">{t('navbar.openShop')}</Typography>
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout} sx={{ gap: 1.5, py: 1.5, color: 'error.main' }}>
                    <LogoutIcon fontSize="small" />
                    <Typography variant="body2">{t('navbar.logout')}</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1, ml: 1 }}>
                <Button size="small" component={Link} to="/login">{t('navbar.login')}</Button>
                <Button variant="contained" size="small" component={Link} to="/register">{t('navbar.register')}</Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
