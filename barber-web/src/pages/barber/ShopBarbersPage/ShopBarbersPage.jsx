import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddBarberDialog from './components/AddBarberDialog';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { useAuthStore } from '@/store/authStore';
import api from '@/api/axios';

export default function ShopBarbersPage() {
  const user = useAuthStore((s) => s.user);
  const tenantId = user?.tenantId;
  const [barbers, setBarbers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snack, setSnack] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newBarberId, setNewBarberId] = useState('');

  const fetchBarbers = async () => {
    if (!tenantId) return;
    setIsLoading(true);
    try {
      const res = await api.get(`/tenants/${tenantId}/barbers`);
      setBarbers(res.data?.list ?? []);
    } catch (err) {
      setError('Berber listesi yuklenemedi.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchBarbers(); }, [tenantId]);

  const handleAddBarber = async () => {
    if (!newBarberId) return;
    try {
      await api.post(`/tenants/${tenantId}/barbers`, { usersId: parseInt(newBarberId), roleInTenant: 'barber' });
      setSnack('Berber eklendi.');
      setDialogOpen(false);
      setNewBarberId('');
      fetchBarbers();
    } catch (err) {
      setError(err.response?.data?.message || 'Berber eklenirken hata olustu.');
    }
  };

  const handleRemoveBarber = async (usersId) => {
    try {
      await api.delete(`/tenants/${tenantId}/barbers/${usersId}`);
      setSnack('Berber cikarildi.');
      fetchBarbers();
    } catch (err) {
      setError(err.response?.data?.message || 'Berber cikarilirken hata olustu.');
    }
  };

  if (!tenantId) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="warning">Bagli oldugunuz bir dukkan bulunamadi.</Alert>
      </Container>
    );
  }

  return (
    <>
    <Box sx={{ py: { xs: 4, md: 6 } }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              sx={{ fontFamily: "'Literata', serif", fontWeight: 700, color: 'text.primary' }}
            >
              Dukkan Berberleri
            </Typography>
            <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => setDialogOpen(true)}>
              Berber Ekle
            </Button>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : barbers.length === 0 ? (
            <Alert severity="info">Dukkanda henuz berber bulunmuyor.</Alert>
          ) : (
            <Card>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Berber</TableCell>
                      <TableCell>Uzmanlik</TableCell>
                      <TableCell>Rol</TableCell>
                      <TableCell>Durum</TableCell>
                      <TableCell align="right">Islem</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {barbers.map((b) => (
                      <TableRow key={b.usersId}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar src={b.usersPhotoUrl || undefined} sx={{ width: 36, height: 36, bgcolor: '#4a7c59' }}>
                              {b.usersName?.[0]?.toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>{b.usersName}</Typography>
                              <Typography variant="caption" color="text.secondary">{b.usersEmail}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{b.usersSpecialty || '-'}</TableCell>
                        <TableCell>
                          <Chip
                            label={b.roleInTenant === 'owner' ? 'Sahip' : 'Berber'}
                            size="small"
                            color={b.roleInTenant === 'owner' ? 'warning' : 'primary'}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={b.isActive ? 'Aktif' : 'Pasif'}
                            size="small"
                            color={b.isActive ? 'success' : 'default'}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {b.roleInTenant !== 'owner' && (
                            <Button
                              size="small"
                              color="error"
                              startIcon={<PersonRemoveIcon />}
                              onClick={() => handleRemoveBarber(b.usersId)}
                            >
                              Cikar
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          )}
        </Container>
      </Box>

      <AddBarberDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        value={newBarberId}
        onChange={setNewBarberId}
        onAdd={handleAddBarber}
      />

      <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack('')} message={snack} />
    </>
  );
}
