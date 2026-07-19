import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

dayjs.locale('tr');

const timeSlots = {
  morning: { label: 'Sabah', icon: <WbSunnyIcon sx={{ fontSize: 16 }} />, slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'] },
  afternoon: { label: 'Öğleden Sonra', icon: <LightModeIcon sx={{ fontSize: 16 }} />, slots: ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'] },
  evening: { label: 'Akşam', icon: <DarkModeIcon sx={{ fontSize: 16 }} />, slots: ['17:00', '17:30', '18:00', '18:30', '19:00'] },
};

export default function DateTimeSelector({ selectedDate, selectedTime, onDateChange, onTimeChange, onBack, onNext }) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
        <Typography variant="subtitle1" fontWeight={700} color="text.primary" sx={{ mb: 1 }}>
          Select Date
        </Typography>
        <Box sx={{
          display: 'flex', justifyContent: 'center',
          bgcolor: 'background.default', borderRadius: 3, mb: 3,
        }}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
            <DateCalendar
              value={selectedDate}
              onChange={(val) => { onDateChange(val); onTimeChange(null); }}
              minDate={dayjs().add(1, 'day')}
              sx={{
                '& .MuiPickersDay-root.Mui-selected': { bgcolor: 'primary.main', color: '#fff' },
                '& .MuiPickersDay-root:hover': { bgcolor: 'action.hover' },
              }}
            />
          </LocalizationProvider>
        </Box>

        {selectedDate && (
          <>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="subtitle1" fontWeight={700} color="text.primary" sx={{ mb: 2.5 }}>
              Available Slots
            </Typography>
            {Object.entries(timeSlots).map(([key, { label, icon, slots }]) => (
              <Box key={key} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Box sx={{ color: 'primary.main', display: 'flex' }}>{icon}</Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    {label}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {slots.map((slot) => (
                    <Button
                      key={slot}
                      variant={selectedTime === slot ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => onTimeChange(slot)}
                      sx={{
                        minWidth: 72,
                        borderColor: 'divider',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        borderRadius: 2,
                        color: selectedTime === slot ? '#fff' : 'text.secondary',
                        '&:hover': { borderColor: 'primary.main' },
                      }}
                    >
                      {slot}
                    </Button>
                  ))}
                </Box>
              </Box>
            ))}
          </>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button variant="outlined" onClick={onBack} sx={{ textTransform: 'none' }}>Geri</Button>
          <Button
            variant="contained"
            disabled={!selectedDate || !selectedTime}
            onClick={onNext}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Devam Et
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
