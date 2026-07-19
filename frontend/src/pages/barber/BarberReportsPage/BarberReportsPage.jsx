import { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent,
  CircularProgress, Alert, List, ListItem, ListItemText, Tabs, Tab
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PeopleIcon from '@mui/icons-material/People';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import api from '@/api/axios';
import StatCard from '@/components/StatCard';

export default function BarberReportsPage() {
  const { hasMinRole } = useRoleGuard();
  const canSeeCustomers = hasMinRole('manager_barber');
  const [tab, setTab] = useState(0);
  const [revenue, setRevenue] = useState(null);
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState(null);
  const [customers, setCustomers] = useState(null);
  const [trend, setTrend] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const requests = [
      api.get('/reports/revenue'),
      api.get('/reports/services'),
      api.get('/reports/stats'),
      api.get('/reports/trend'),
      ...(canSeeCustomers ? [api.get('/reports/customers')] : []),
    ];
    Promise.allSettled(requests).then(([revRes, svcRes, statsRes, trendRes, custRes]) => {
      if (revRes.status === 'fulfilled') setRevenue(revRes.value.data?.data);
      if (svcRes.status === 'fulfilled') setServices(svcRes.value.data?.list ?? []);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data?.data);
      if (trendRes.status === 'fulfilled') setTrend(trendRes.value.data?.list ?? []);
      if (custRes?.status === 'fulfilled') setCustomers(custRes.value.data?.data);
    }).catch(() => setError('Raporlar yüklenemedi.')).finally(() => setIsLoading(false));
  }, []);

  return (
      <Container maxWidth="lg" sx={{ py: 6, flex: 1 }}>
        <Typography variant="h4" fontWeight={700} mb={4}>Raporlar</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {isLoading && <CircularProgress />}

        {!isLoading && (
          <>
            <Grid container spacing={3} mb={4}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard
                  title="Toplam Gelir"
                  value={revenue?.total ? `₺${revenue.total}` : '₺0'}
                  icon={<MonetizationOnIcon />}
                  color="#2e7d32"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard
                  title="Bu Ay Gelir"
                  value={revenue?.thisMonth ? `₺${revenue.thisMonth}` : '₺0'}
                  icon={<TrendingUpIcon />}
                  color="#4a7c59"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard
                  title="Toplam Randevu"
                  value={stats?.total}
                  icon={<ContentCutIcon />}
                  color="#705c30"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard
                  title="Müşteri Sayısı"
                  value={customers?.totalCustomers}
                  icon={<PeopleIcon />}
                  color="#1565c0"
                />
              </Grid>
            </Grid>

            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
              <Tab label="Popüler Hizmetler" />
              <Tab label="Aylık Trend" />
            </Tabs>

            {tab === 0 && (
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" mb={2}>En Çok Tercih Edilen Hizmetler</Typography>
                  <List dense>
                    {services.map((s, i) => (
                      <ListItem key={i} divider>
                        <ListItemText
                          primary={s.servicesName}
                          secondary={`${s.bookingCount} randevu • ₺${s.revenue ?? 0} gelir`}
                        />
                      </ListItem>
                    ))}
                    {services.length === 0 && (
                      <ListItem><ListItemText primary="Veri yok" /></ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            )}

            {tab === 1 && (
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" mb={2}>Aylık Randevu Trendi</Typography>
                  <List dense>
                    {trend.map((t, i) => (
                      <ListItem key={i} divider>
                        <ListItemText
                          primary={`${t.month}`}
                          secondary={`${t.total} randevu`}
                        />
                      </ListItem>
                    ))}
                    {trend.length === 0 && (
                      <ListItem><ListItemText primary="Veri yok" /></ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </Container>
  );
}
