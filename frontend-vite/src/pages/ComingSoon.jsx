import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { ArrowBack, Timer } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import logoCitoPlus from '../assets/images/logo-citoplus.png';

const citoPlusTheme = createTheme({
  palette: {
    primary: {
      main: '#E67E22',
      contrastText: '#fff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

// Placeholder para features en desarrollo
export default function ComingSoon() {
  return (
    <ThemeProvider theme={citoPlusTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Container maxWidth="md" sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <Paper
            elevation={0}
            sx={{
              width: '100%',
              textAlign: 'center',
              py: 8,
              px: 4,
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
            }}
          >
            {/* Decoración de fondo */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '150px',
                height: '150px',
                background: 'linear-gradient(135deg, #E67E22 0%, #F39C12 100%)',
                opacity: 0.1,
                borderRadius: '0 0 0 100%',
              }}
            />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              {/* Logo */}
              <Box sx={{ mb: 4 }}>
                <img
                  src={logoCitoPlus}
                  alt="CitoPlus"
                  style={{ height: '50px' }}
                />
              </Box>

              {/* Icono de temporizador */}
              <Timer sx={{ fontSize: 80, color: '#E67E22', mb: 3 }} />

              {/* Título */}
              <Typography 
                variant="h3" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #E67E22 0%, #F39C12 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2
                }}
              >
                Próximamente
              </Typography>

              {/* Descripción */}
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ 
                  mb: 4,
                  maxWidth: '600px',
                  mx: 'auto'
                }}
              >
                Estamos trabajando en nuevas funcionalidades para mejorar tu experiencia. 
                ¡Vuelve pronto para descubrir las novedades!
              </Typography>

              {/* Botón de regreso */}
              <Button
                component={Link}
                to="/user"
                startIcon={<ArrowBack />}
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  backgroundColor: '#E67E22',
                  '&:hover': {
                    backgroundColor: '#D35400',
                  },
                }}
              >
                Volver al Panel
              </Button>
            </Box>

            {/* Decoración de fondo inferior */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '150px',
                height: '150px',
                background: 'linear-gradient(135deg, #E67E22 0%, #F39C12 100%)',
                opacity: 0.1,
                borderRadius: '0 100% 0 0',
              }}
            />
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}