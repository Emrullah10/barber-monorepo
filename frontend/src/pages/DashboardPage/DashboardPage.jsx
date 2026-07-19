import { useAuthStore } from '@/store/authStore';
import { useServices } from '@/features/services/hooks/useServices';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Chip,
    Button
} from '@mui/material';

// Icons
import ContentCutIcon from '@mui/icons-material/ContentCut';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useState } from 'react';

const drawerWidth = 240;

export const DashboardPage = () => {
    const { user, logoutAction } = useAuthStore();
    const { services, isLoading, error } = useServices();

    // Mobil uyumluluk için Drawer state'i
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // Sol Menü İçeriği
    const drawer = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Toolbar>
                <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Barber Makro
                </Typography>
            </Toolbar>
            <Divider />
            <List sx={{ flexGrow: 1 }}>
                <ListItem disablePadding>
                    <ListItemButton selected>
                        <ListItemIcon>
                            <ContentCutIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Hizmetler" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <CalendarMonthIcon />
                        </ListItemIcon>
                        <ListItemText primary="Randevular" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Müşteriler" />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            <Box sx={{ p: 2 }}>
                <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    startIcon={<LogoutIcon />}
                    onClick={logoutAction}
                >
                    Çıkış Yap
                </Button>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Üst Bar (AppBar) */}
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: 1
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="menüyü aç"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="h6" noWrap component="div">
                            Hoş Geldiniz, {user?.usersName || 'Yönetici'}
                        </Typography>
                        <Chip
                            label={user?.usersRole === 'barber' ? 'Berber/Admin' : 'Müşteri'}
                            color="primary"
                            size="small"
                            variant="outlined"
                        />
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Sol Menü (Drawer) */}
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                {/* Mobil için çekmece */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                {/* Masaüstü için sabit çekmece */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* İçerik Alanı */}
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                {/* AppBar'ın altına itmek için sahte boşluk */}
                <Toolbar />

                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'medium', color: 'text.secondary' }}>
                    Aktif Hizmet Listesi
                </Typography>

                {/* Yükleniyor Durumu */}
                {isLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                        <CircularProgress />
                    </Box>
                )}

                {/* Hata Durumu */}
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* Boş Liste Durumu */}
                {!isLoading && !error && services.length === 0 && (
                    <Alert severity="info">
                        Henüz sisteme eklenmiş bir hizmet bulunmamaktadır.
                    </Alert>
                )}

                {/* Hizmet Listesi */}
                {!isLoading && !error && services.length > 0 && (
                    <Grid container spacing={3}>
                        {services.map((svc) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={svc.servicesId}>
                                <Card
                                    elevation={2}
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: '0.3s',
                                        '&:hover': { transform: 'translateY(-5px)', boxShadow: 6, cursor: 'pointer' }
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                                {svc.servicesName}
                                            </Typography>
                                            <Chip label={`${svc.servicesPrice} ₺`} color="success" size="small" />
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                            <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                                            <Typography variant="body2">
                                                {svc.servicesDurationMin} Dakika
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Box>
    );
};
