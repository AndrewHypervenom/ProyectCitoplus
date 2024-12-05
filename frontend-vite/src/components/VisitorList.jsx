import React, { useContext, useEffect, useState } from 'react';
import { 
  Box, 
  Container,
  Button, 
  TextField, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Paper,
  IconButton,
  ThemeProvider,
  createTheme,
  Divider,
  MenuItem,
  Chip,
  TableContainer,
  Alert,
  Snackbar,
  Tooltip
} from '@mui/material';
import { 
  Search,
  Add as AddIcon,
  ArrowBack,
  PersonAdd
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

// Estados de visita con colores
const estados = [
  { value: 'pendiente', label: 'Pendiente', color: '#f39c12' },
  { value: 'autorizado', label: 'Autorizado', color: '#2ecc71' },
  { value: 'en_progreso', label: 'En Progreso', color: '#3498db' },
  { value: 'finalizado', label: 'Finalizado', color: '#27ae60' },
  { value: 'rechazado', label: 'Rechazado', color: '#e74c3c' },
  { value: 'cancelado', label: 'Cancelado', color: '#95a5a6' },
  { value: 'expirado', label: 'Expirado', color: '#7f8c8d' },
  { value: 'bloqueado', label: 'Bloqueado', color: '#c0392b' },
  { value: 'reprogramado', label: 'Reprogramado', color: '#8e44ad' },
  { value: 'sin_confirmar', label: 'Sin Confirmar', color: '#bdc3c7' }
];

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
            borderRadius: 8,
          },
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
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

// Gestión de visitantes - Admin/Usuario
export default function VisitorList() {
  const { token } = useContext(AuthContext);
  const [filtro, setFiltro] = useState({ nombre: '', numero_identificacion: '', fecha: '' });
  const [visitors, setVisitors] = useState([]);
  const [newVisitor, setNewVisitor] = useState({ 
    nombre: '', 
    numero_identificacion: '', 
    motivo: '', 
    estado: 'sin_confirmar' 
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showNewVisitorForm, setShowNewVisitorForm] = useState(false);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // CRUD operations
  const fetchVisitors = async () => {
    const params = new URLSearchParams();
    if (filtro.nombre) params.append('nombre', filtro.nombre);
    if (filtro.numero_identificacion) params.append('numero_identificacion', filtro.numero_identificacion);
    if (filtro.fecha) params.append('fecha', filtro.fecha);

    try {
      const res = await fetch(`http://localhost:5000/visitors?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setVisitors(data);
      } else {
        showSnackbar('Error al obtener visitantes', 'error');
      }
    } catch (error) {
      showSnackbar('Error de conexión', 'error');
    }
  };

  const createVisitor = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/visitors', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newVisitor)
      });
      if (res.ok) {
        setNewVisitor({ nombre: '', numero_identificacion: '', motivo: '', estado: 'sin_confirmar' });
        showSnackbar('Visitante registrado exitosamente');
        setShowNewVisitorForm(false);
        fetchVisitors();
      } else {
        showSnackbar('Error al registrar visitante', 'error');
      }
    } catch (error) {
      showSnackbar('Error de conexión', 'error');
    }
  };

  const updateVisitorStatus = async (id, estado) => {
    try {
      const res = await fetch(`http://localhost:5000/visitors/${id}/estado`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado })
      });
      if (res.ok) {
        fetchVisitors();
        showSnackbar('Estado actualizado correctamente');
      } else {
        showSnackbar('Error al actualizar el estado', 'error');
      }
    } catch (error) {
      showSnackbar('Error de conexión', 'error');
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  return (
    <ThemeProvider theme={citoPlusTheme}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Encabezado */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            component={Link}
            to="/admin"
            startIcon={<ArrowBack />}
            sx={{ color: 'text.secondary' }}
          >
            Volver al dashboard
          </Button>
          <Divider orientation="vertical" flexItem />
          <Typography variant="h4" sx={{ fontWeight: 500 }}>
            Gestión de Visitantes
          </Typography>
        </Box>

        {/* Filtros de búsqueda */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              flexWrap: 'wrap',
              flex: 1
            }}>
              <TextField 
                placeholder="Buscar por nombre"
                size="small"
                value={filtro.nombre}
                onChange={(e) => setFiltro({ ...filtro, nombre: e.target.value })}
                autoComplete="off"
                InputProps={{
                  startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
                }}
                sx={{ minWidth: '200px' }}
              />
              <TextField 
                placeholder="Número de identificación"
                size="small"
                value={filtro.numero_identificacion}
                onChange={(e) => setFiltro({ ...filtro, numero_identificacion: e.target.value })}
                autoComplete="off"
                sx={{ minWidth: '200px' }}
              />
              <TextField 
                type="date"
                size="small"
                value={filtro.fecha}
                onChange={(e) => setFiltro({ ...filtro, fecha: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: '200px' }}
              />
              <Button 
                variant="contained" 
                onClick={fetchVisitors}
                startIcon={<Search />}
              >
                Buscar
              </Button>
            </Box>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => setShowNewVisitorForm(!showNewVisitorForm)}
            >
              Nuevo Visitante
            </Button>
          </Box>

          {/* Formulario de nuevo visitante */}
          {showNewVisitorForm && (
            <Box 
              component="form" 
              onSubmit={createVisitor}
              sx={{ 
                mt: 3,
                pt: 3,
                borderTop: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap'
              }}
            >
              <TextField 
                label="Nombre"
                size="small"
                value={newVisitor.nombre}
                onChange={(e) => setNewVisitor({ ...newVisitor, nombre: e.target.value })}
                required
                autoComplete="off"
                sx={{ flex: 1, minWidth: '200px' }}
              />
              <TextField 
                label="Número de Identificación"
                size="small"
                value={newVisitor.numero_identificacion}
                onChange={(e) => setNewVisitor({ ...newVisitor, numero_identificacion: e.target.value })}
                required
                autoComplete="off"
                sx={{ flex: 1, minWidth: '200px' }}
              />
              <TextField 
                label="Motivo"
                size="small"
                value={newVisitor.motivo}
                onChange={(e) => setNewVisitor({ ...newVisitor, motivo: e.target.value })}
                required
                autoComplete="off"
                sx={{ flex: 1, minWidth: '200px' }}
              />
              <TextField
                select
                size="small"
                label="Estado"
                value={newVisitor.estado}
                onChange={(e) => setNewVisitor({ ...newVisitor, estado: e.target.value })}
                sx={{ minWidth: '200px' }}
              >
                {estados.map((estado) => (
                  <MenuItem key={estado.value} value={estado.value}>
                    {estado.label}
                  </MenuItem>
                ))}
              </TextField>
              <Button 
                type="submit" 
                variant="contained"
                startIcon={<AddIcon />}
              >
                Registrar Visitante
              </Button>
            </Box>
          )}
        </Paper>

        {/* Tabla de visitantes */}
        <Paper>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Identificación</TableCell>
                  <TableCell>Fecha Visita</TableCell>
                  <TableCell>Fecha Salida</TableCell>
                  <TableCell>Motivo</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visitors.map(v => (
                  <TableRow key={v.id} hover>
                    <TableCell>{v.nombre}</TableCell>
                    <TableCell>{v.numero_identificacion}</TableCell>
                    <TableCell>{new Date(v.fecha_visita).toLocaleString()}</TableCell>
                    <TableCell>
                      {v.fecha_salida 
                        ? new Date(v.fecha_salida).toLocaleString() 
                        : 'N/A'}
                    </TableCell>
                    <TableCell>{v.motivo}</TableCell>
                    <TableCell>
                      <TextField
                        select
                        size="small"
                        value={v.estado}
                        onChange={(e) => updateVisitorStatus(v.id, e.target.value)}
                        sx={{ minWidth: 150 }}
                      >
                        {estados.map((estado) => (
                          <MenuItem key={estado.value} value={estado.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box 
                                sx={{ 
                                  width: 8, 
                                  height: 8, 
                                  borderRadius: '50%', 
                                  bgcolor: estado.color 
                                }} 
                              />
                              {estado.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </TextField>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Snackbar para mensajes */}
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={4000} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            variant="filled"
            elevation={6}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}