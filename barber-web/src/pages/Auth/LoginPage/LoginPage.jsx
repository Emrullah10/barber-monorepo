import { useState } from "react";
import { useLogin } from "@/features/iam/hooks/useLogin";
import { useAuthStore } from "@/store/authStore";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import Link from "@mui/material/Link";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import { Link as RouterLink } from "react-router-dom";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, loading, error } = useLogin();
  const { isLoggedIn, user, logoutAction } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  // Zaten giriş yapmışsa (Dashboard'a yönlendirmek yerine şimdilik burada bilgi gösteriyoruz)
  if (isLoggedIn) {
    return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper
            elevation={3}
            sx={{ p: 4, width: "100%", textAlign: "center" }}
          >
            <Avatar sx={{ m: "auto", bgcolor: "success.main", mb: 2 }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" gutterBottom>
              Hoşgeldiniz, {user?.usersName}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Rolünüz: <strong>{user?.usersRole}</strong>
            </Typography>
            <Button
              variant="contained"
              color="error"
              fullWidth
              onClick={logoutAction}
            >
              Sistemden Çık
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  // Giriş yapmamışsa (Login Form)
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Barber Makro
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Adresi"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Şifre"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "GİRİŞ YAP"
              )}
            </Button>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Hesabın yok mu?{" "}
              <Link component={RouterLink} to="/register" sx={{ fontWeight: 600 }}>
                Kayıt Ol
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
