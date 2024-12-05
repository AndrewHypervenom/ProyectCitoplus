import React, { useContext } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  Container,
  Paper,
  Grid,
  ThemeProvider,
  createTheme,
  Card,
  CardContent,
  CardActionArea,
  IconButton,
} from '@mui/material';
import { 
  ExitToApp as ExitToAppIcon,
  People as PeopleIcon,
  DateRange as DateRangeIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logoCitoPlus from '../assets/images/logo-citoplus.png';

const citoPlusTheme = createTheme({
  palette: {
    primary: {
      main: '#E67E22',
      contrastText: '#fff',
    },
    secondary: {
      main: '#2980B9',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#E67E22',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          },
        },
      },
    },
  },
});

// Dashboard usuario regular
export default function UserDashboard() {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const menuItems = [
    {
      title: 'Gestionar Visitantes',
      description: 'Registra y administra los visitantes del edificio',
      icon: <PeopleIcon sx={{ fontSize: 40, color: '#E67E22' }} />,
      link: '/user/visitors',
      stats: 'Gestión de accesos',
    },
    {
      title: 'Mi Perfil',
      description: 'Administra tu información personal y preferencias',
      icon: <PersonIcon sx={{ fontSize: 40, color: '#3498db' }} />,
      link: '/user/profile',
      stats: 'Datos personales',
    },
    {
      title: 'Calendario',
      description: 'Visualiza y programa las visitas',
      icon: <DateRangeIcon sx={{ fontSize: 40, color: '#2ecc71' }} />,
      link: '/user/calendar',
      stats: 'Programación',
    },
  ];

  return (
    <ThemeProvider theme={citoPlusTheme}>
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}>
        {/* AppBar */}
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <Box sx={{ 
                bgcolor: '#fff',
                p: 0.8,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                mr: 2,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <img 
                  src={logoCitoPlus} 
                  alt="CitoPlus" 
                  style={{ height: '28px' }}
                />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                Panel de Usuario
              </Typography>
            </Box>
            <Button 
              color="inherit" 
              onClick={handleLogout}
              startIcon={<ExitToAppIcon />}
              sx={{ 
                fontWeight: 500,
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.1)'
                }
              }}
            >
              Cerrar Sesión
            </Button>
          </Toolbar>
        </AppBar>

        {/* Contenido principal */}
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Saludo y estadísticas */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              mb: 4, 
              borderRadius: 3,
              background: 'linear-gradient(135deg, #E67E22 0%, #F39C12 100%)',
              color: 'white'
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
              Bienvenido, {user?.nombre_usuario}
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Accede a todas las funciones de gestión de visitantes desde tu panel personalizado
            </Typography>
          </Paper>

          {/* Grid de menú */}
          <Grid container spacing={3}>
            {menuItems.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardActionArea 
                    component={Link} 
                    to={item.link}
                    sx={{ height: '100%' }}
                  >
                    <CardContent sx={{ 
                      p: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      gap: 2
                    }}>
                      {item.icon}
                      <Box>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                      </Box>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          mt: 'auto',
                          pt: 2,
                          color: 'primary.main',
                          fontWeight: 500
                        }}
                      >
                        {item.stats}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}