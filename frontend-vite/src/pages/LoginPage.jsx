import React, { useState, useContext } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Paper,
  IconButton,
  InputAdornment,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { loginApi } from '../api/auth';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import logoCitoPlus from '../assets/images/logo-citoplus.png';

const citoPlusTheme = createTheme({
  palette: {
    primary: {
      main: '#E67E22',
      contrastText: '#fff',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 50,
            backgroundColor: '#fff',
            '&.Mui-focused fieldset': {
              borderColor: '#E67E22',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          boxShadow: 'none',
          textTransform: 'none',
        },
      },
    },
  },
});

// LoginPage: Maneja autenticación inicial
export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [nombre_usuario, setNombreUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Redirección según rol
    try {
      const { token, user } = await loginApi(nombre_usuario, password);
      login(token, user);
      if (user.rol === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/user';
      }      
    } catch(err) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <ThemeProvider theme={citoPlusTheme}>
      <CssBaseline />
      <Box 
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
        }}
      >
        <Container maxWidth="xs" sx={{ textAlign: 'center' }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              px: 2,
            }}
          >
            {/* Logo */}
            <Box sx={{ mb: 4, width: '100%', maxWidth: 300 }}>
              <img 
                src={logoCitoPlus} 
                alt="CitoPlus" 
                style={{ 
                  width: '100%',
                  height: 'auto',
                }} 
              />
            </Box>

            {error && (
              <Box 
                sx={{ 
                  width: '100%',
                  bgcolor: 'rgba(211, 47, 47, 0.1)',
                  color: '#d32f2f',
                  p: 1.5,
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                <Typography variant="body2">{error}</Typography>
              </Box>
            )}

            {/* Campos de entrada */}
            <Box sx={{ width: '100%', mb: 2 }}>
              <TextField
                placeholder="Nombre de usuario"
                fullWidth
                value={nombre_usuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
                required
                autoComplete="username"
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box component="span" sx={{ color: '#999' }}>👤</Box>
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                placeholder="Contraseña"
                fullWidth
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box component="span" sx={{ color: '#999' }}>🔑</Box>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#999' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Botón de ingreso */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                py: 1.5,
                fontSize: '1rem',
                backgroundColor: '#E67E22',
                '&:hover': {
                  backgroundColor: '#D35400',
                },
              }}
            >
              Ingresar
            </Button>

            {/* Enlace de olvidó contraseña momentaneamente para usos esteticos*/}
            <Typography 
              variant="body2" 
              sx={{ 
                mt: 2, 
                color: '#E67E22',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              ¿Olvidó su contraseña?
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}