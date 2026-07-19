import { Box, Card, CardContent, Typography } from '@mui/material';

export default function StatCard({ title, value, icon, color }) {
  return (
    <Card variant="outlined">
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ color, display: 'flex', fontSize: 32 }}>{icon}</Box>
        <Box>
          <Typography variant="h5" fontWeight={700}>{value ?? '-'}</Typography>
          <Typography variant="body2" color="text.secondary">{title}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
