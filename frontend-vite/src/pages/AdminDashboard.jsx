import React, { useContext, useEffect, useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Grid, 
  Paper,
  Container,
  IconButton,
  useTheme,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';
import { 
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  ExitToApp as ExitToAppIcon
} from '@mui/icons-material';
import logoCitoPlus from '../assets/images/logo-citoplus.png';

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
);

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
        contained: {
          borderRadius: 25,
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

// Dashboard admin: Stats y métricas
export default function AdminDashboard() {
  const { user, logout, token } = useContext(AuthContext);
  const [stats, setStats] = useState(null);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:5000/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        console.error('Error al obtener estadísticas');
      }
    } catch (error) {
      console.error('Error en la petición:', error);
    }
  };

  // Fetching de métricas
  useEffect(() => {
    fetchStats();
  }, []);

  if (!stats) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Typography>Cargando estadísticas...</Typography>
      </Box>
    );
  }

  // Configuración común para los graficos de torta
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 11
          }
        }
      }
    }
  };

  // Datos para los gráficos
  const visitorStatesData = {
    labels: stats.visitors.map(v => v.estado.replace('_', ' ').toUpperCase()),
    datasets: [{
      data: stats.visitors.map(v => parseInt(v.count)),
      backgroundColor: [
        '#FF6B6B', // Rojo suave
        '#4ECDC4', // Turquesa
        '#FFD93D', // Amarillo
        '#6C5CE7', // Púrpura
        '#A8E6CF', // Verde menta
        '#FF8B94', // Rosa
        '#98DDCA'  // Verde agua
      ]
    }]
  };

  const userStatusData = {
    labels: ['Activos', 'Inactivos'],
    datasets: [{
      data: [parseInt(stats.users.activos), parseInt(stats.users.inactivos)],
      backgroundColor: ['#4ECDC4', '#FF6B6B']
    }]
  };

  const visitorsByMotivoData = {
    labels: stats.visitorsByMotivo.map(m => m.motivo),
    datasets: [{
      data: stats.visitorsByMotivo.map(m => parseInt(m.count)),
      backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFD93D', '#6C5CE7', '#A8E6CF']
    }]
  };

  return (
    <ThemeProvider theme={citoPlusTheme}>
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        {/* AppBar */}
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              {/* Contenedor */}
              <Box 
                component={Link} 
                to="/admin"
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: 'inherit',
                  mr: 2,
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  p: '4px',
                  height: '32px',
                  width: '80px',
                  mr: 1
                }}>
                  <img 
                    src={logoCitoPlus} 
                    alt="CitoPlus" 
                    style={{ 
                      height: '100%',
                      width: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 500,
                    color: 'white'
                  }}
                >
                  Panel de Administración
                </Typography>
              </Box>
            </Box>
            <Button 
              color="inherit" 
              onClick={handleLogout}
              startIcon={<ExitToAppIcon />}
            >
              CERRAR SESIÓN
            </Button>
          </Toolbar>
        </AppBar>

        {/* Contenido principal */}
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'text.primary', fontWeight: 500 }}>
              Bienvenido, {user?.nombre_usuario}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                component={Link}
                to="/admin/users"
                startIcon={<PeopleIcon />}
              >
                Gestionar Usuarios
              </Button>
              <Button
                variant="contained"
                component={Link}
                to="/admin/visitors"
                startIcon={<PersonAddIcon />}
              >
                Gestionar Visitantes
              </Button>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* Gráficos de torta */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '400px' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                  Visitantes por Estado
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Pie data={visitorStatesData} options={pieOptions} />
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '400px' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                  Usuarios Activos vs Inactivos
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Pie data={userStatusData} options={pieOptions} />
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '400px' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                  Visitantes por Motivo
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Pie data={visitorsByMotivoData} options={pieOptions} />
                </Box>
              </Paper>
            </Grid>

            {/* Estadística destacada */}
            <Grid item xs={12}>
              <Paper sx={{ 
                p: 4, 
                textAlign: 'center',
                background: 'linear-gradient(45deg, #E67E22 30%, #F39C12 90%)',
                color: 'white'
              }}>
                <Typography variant="h6" gutterBottom>
                  Duración Promedio de Visitas
                </Typography>
                <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                  {parseFloat(stats.avgVisitDuration).toFixed(0)} min
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}