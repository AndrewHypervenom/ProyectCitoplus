import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Alert,
  Snackbar,
  Container,
  Chip,
  ThemeProvider,
  createTheme,
  Tooltip,
  Divider,
  TableContainer
} from '@mui/material';
import { 
  Block, 
  Check, 
  Delete, 
  PersonAdd, 
  Search,
  ArrowBack
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const citoPlusTheme = createTheme({
  palette: {
    primary: {
      main: '#E67E22',
      contrastText: '#fff',
    },
    error: {
      main: '#e74c3c',
    },
    success: {
      main: '#2ecc71',
    }
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
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
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

// Gestión CRUD de usuarios para Admin
export default function UserManagement() {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ nombre_usuario: '', password: '' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');

  // Función para obtener usuarios
  const fetchUsers = async () => {
    const res = await fetch('http://localhost:5000/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    } else {
      showSnackbar('Error al cargar los usuarios', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // CRUD operations
  const createUser = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/users', {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    });
    
    if (res.ok) {
      setNewUser({ nombre_usuario: '', password: '' });
      fetchUsers();
      showSnackbar('Usuario creado exitosamente');
    } else {
      const data = await res.json();
      showSnackbar(data.error || 'Error al crear el usuario', 'error');
    }
  };

  const toggleUserStatus = async (id, currentStatus) => {
    const res = await fetch(`http://localhost:5000/users/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ estado: !currentStatus })
    });
    
    if (res.ok) {
      fetchUsers();
      showSnackbar('Estado del usuario actualizado correctamente');
    } else {
      showSnackbar('Error al actualizar el estado del usuario', 'error');
    }
  };

  const deleteUser = async () => {
    if (!userToDelete) return;

    const res = await fetch(`http://localhost:5000/users/${userToDelete.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    
    if (res.ok) {
      fetchUsers();
      showSnackbar('Usuario eliminado correctamente');
    } else {
      showSnackbar(data.error || 'Error al eliminar el usuario', 'error');
    }
    
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  // Fetch inicial usuarios
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtrado usuarios
  const filteredUsers = users.filter(user => 
    user.nombre_usuario.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            Gestión de Usuarios
          </Typography>
        </Box>

        {/* Sección de búsqueda y creación */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between'
          }}>
            {/* Formulario de creación */}
            <Box component="form" onSubmit={createUser} sx={{ 
              display: 'flex', 
              gap: 2,
              flexWrap: 'wrap',
              flex: 1,
              minWidth: '300px'
            }}>
              <TextField 
                label="Nombre de usuario"
                size="small"
                value={newUser.nombre_usuario}
                onChange={(e) => setNewUser({ ...newUser, nombre_usuario: e.target.value })}
                required
                autoComplete="off" // Desactivar autocompletado
                inputProps={{
                  autoComplete: 'new-password' // Truco para forzar que no se autocomplete
                }}
                sx={{ flex: 1, minWidth: '200px' }}
              />

              <TextField 
                label="Contraseña"
                size="small"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required
                autoComplete="new-password"
                inputProps={{
                  autoComplete: 'new-password'
                }}
                sx={{ flex: 1, minWidth: '200px' }}
              />
              <Button 
                type="submit" 
                variant="contained" 
                startIcon={<PersonAdd />}
                sx={{ height: '40px' }}
              >
                Crear Usuario
              </Button>
            </Box>

            {/* Buscador */}
            <TextField
              placeholder="Buscar usuario..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
              InputProps={{
                startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
              }}
              sx={{ minWidth: '250px' }}
            />
          </Box>
        </Paper>

        {/* Tabla de usuarios */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Fecha Creación</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map(u => (
                  <TableRow key={u.id} hover>
                    <TableCell>{u.id}</TableCell>
                    <TableCell>{u.nombre_usuario}</TableCell>
                    <TableCell>{new Date(u.fecha_creacion).toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip 
                        label={u.estado ? 'Activo' : 'Inactivo'}
                        color={u.estado ? 'success' : 'error'}
                        size="small"
                        sx={{ minWidth: 80 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={u.estado ? 'Desactivar' : 'Activar'}>
                        <IconButton 
                          size="small"
                          color={u.estado ? 'error' : 'success'} 
                          onClick={() => toggleUserStatus(u.id, u.estado)}
                        >
                          {u.estado ? <Block /> : <Check />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={u.id === 1 ? 'No se puede eliminar al administrador' : 'Eliminar'}>
                        <span>
                          <IconButton 
                            size="small"
                            color="error"
                            onClick={() => {
                              setUserToDelete(u);
                              setDeleteDialogOpen(true);
                            }}
                            disabled={u.id === 1}
                          >
                            <Delete />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Diálogo de confirmación */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>¿Eliminar usuario?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Está seguro que desea eliminar al usuario <strong>{userToDelete?.nombre_usuario}</strong>?
              Esta acción no se puede deshacer.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={deleteUser} 
              color="error" 
              variant="contained"
              startIcon={<Delete />}
            >
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
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