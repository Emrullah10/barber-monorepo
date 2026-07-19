import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useShops } from '@/features/shops/hooks/useShops';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const DEFAULT_CENTER = [41.0082, 28.9784];

export default function MapView() {
  const navigate = useNavigate();
  const { shops, isLoading } = useShops();
  const [selectedShop, setSelectedShop] = useState(null);

  const shopsWithCoords = useMemo(
    () => shops.filter((s) => s.tenantLatitude && s.tenantLongitude),
    [shops],
  );

  const center = useMemo(() => {
    if (shopsWithCoords.length > 0) {
      return [shopsWithCoords[0].tenantLatitude, shopsWithCoords[0].tenantLongitude];
    }
    return DEFAULT_CENTER;
  }, [shopsWithCoords]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: { xs: 'auto', md: '70vh' }, minHeight: 500, flexDirection: { xs: 'column', md: 'row' }, gap: 0 }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: { xs: '100%', md: 360 },
          flexShrink: 0,
          bgcolor: 'background.paper',
          borderRight: { md: '1px solid' },
          borderColor: 'divider',
          overflow: 'auto',
          p: 3,
        }}
      >
        <Typography variant="h6" fontWeight={700} sx={{ fontFamily: "'Literata', serif", mb: 2 }}>
          Nearby Shops
        </Typography>

        {shopsWithCoords.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No shops with location data yet.
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {shopsWithCoords.map((shop) => (
            <Card
              key={shop.tenantId}
              sx={{
                cursor: 'pointer',
                border: selectedShop === shop.tenantId ? '2px solid' : '1px solid',
                borderColor: selectedShop === shop.tenantId ? 'primary.main' : 'divider',
                '&:hover': { borderColor: 'primary.main' },
              }}
              onClick={() => setSelectedShop(shop.tenantId)}
            >
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ fontFamily: "'Literata', serif" }}>
                    {shop.tenantName}
                  </Typography>
                </Box>
                {shop.tenantCity && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', mb: 1 }}>
                    <LocationOnIcon sx={{ fontSize: 14 }} />
                    <Typography variant="caption">{shop.tenantCity}</Typography>
                  </Box>
                )}
                {shop.tenantAddress && (
                  <Typography variant="caption" color="text.secondary">
                    {shop.tenantAddress}
                  </Typography>
                )}
                <Box sx={{ mt: 1.5 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(e) => { e.stopPropagation(); navigate(`/shops/${shop.tenantSlug}`); }}
                  >
                    View Shop
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Map */}
      <Box sx={{ flex: 1, minHeight: { xs: 400, md: 'auto' }, position: 'relative' }}>
        <MapContainer
          center={center}
          zoom={13}
          style={{ width: '100%', height: '100%', minHeight: 400, borderRadius: '0 12px 12px 0' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {shopsWithCoords.map((shop) => (
            <Marker key={shop.tenantId} position={[shop.tenantLatitude, shop.tenantLongitude]}>
              <Popup>
                <strong>{shop.tenantName}</strong><br />
                {shop.tenantCity && <>{shop.tenantCity}<br /></>}
                {shop.tenantAddress}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>
    </Box>
  );
}
