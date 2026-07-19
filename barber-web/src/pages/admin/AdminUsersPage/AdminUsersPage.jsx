import { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Stack,
  Avatar, Chip, Button, MenuItem, Select, Alert, CircularProgress, TextField
} from '@mui/material';
import api from '@/api/axios';

const TYPE_COLORS = {
  admin: 'error',
  manager_barber: 'warning',
  barber: 'primary',
  customer: 'default',
};

const TYPE_OPTIONS = [
  { value: 'customer', label: 'Müşteri' },
  { value: 'barber', label: 'Berber' },
  { value: 'manager_barber', label: 'Yönetici Berber' },
  { value: 'admin', label: 'Admin' },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const fetchUsers = () => {
    setIsLoading(true);
    api.get('/users')
      .then((res) => setUsers(res.data?.list ?? []))
      .catch(() => setError('Kullanıcılar yüklenemedi.'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleTypeChange = async (userId, newTypeCode) => {
    setUpdating(userId);
    try {
      await api.patch(`/users/${userId}/type`, { userTypeCode: newTypeCode });
      fetchUsers();
    } catch {
      // ignore
    } finally {
      setUpdating(null);
    }
  };

  const filtered = users.filter((u) =>
    u.usersName?.toLowerCase().includes(search.toLowerCase()) ||
    u.usersEmail?.toLowerCase().includes(search.toLowerCase())
  );

  return (
      <Container maxWidth="md" sx={{ py: 6, flex: 1 }}>
        <Typography variant="h4" fontWeight={700} mb={4}>Kullanıcı Yönetimi</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          placeholder="İsim veya e-posta ile ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          fullWidth
          sx={{ mb: 3 }}
        />

        {isLoading && <CircularProgress />}

        <Stack spacing={2}>
          {filtered.map((u) => (
            <Card key={u.usersId} variant="outlined">
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {u.usersName?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography fontWeight={600}>{u.usersName}</Typography>
                      <Typography variant="body2" color="text.secondary">{u.usersEmail}</Typography>
                    </Box>
                  </Stack>
                  <Stack alignItems="flex-end" spacing={1}>
                    <Chip
                      label={u.userTypeName ?? u.userTypeCode}
                      color={TYPE_COLORS[u.userTypeCode] ?? 'default'}
                      size="small"
                    />
                    <Select
                      value={u.userTypeCode ?? 'customer'}
                      size="small"
                      disabled={updating === u.usersId}
                      onChange={(e) => handleTypeChange(u.usersId, e.target.value)}
                      sx={{ minWidth: 160 }}
                    >
                      {TYPE_OPTIONS.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                      ))}
                    </Select>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
          {!isLoading && filtered.length === 0 && (
            <Typography color="text.secondary">Kullanıcı bulunamadı.</Typography>
          )}
        </Stack>
      </Container>
  );
}
