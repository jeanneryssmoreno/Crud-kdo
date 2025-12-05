import { useState } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  Container,
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  TextField,
  MenuItem,
  Paper,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useNavigate } from 'react-router-dom';
import TablaInscripciones from '../components/TablaInscripciones';
import DetalleInscripcion from '../components/DetalleInscripcion';
import ThemeToggle from '../components/ThemeToggle';
import { Inscripcion } from '../types/Inscripcion';

const API_URL = 'http://localhost:3000/inscripciones';

export default function InscritosPage() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detalleDialogOpen, setDetalleDialogOpen] = useState(false);
  const [inscripcionEliminar, setInscripcionEliminar] = useState<number | null>(null);
  const [inscripcionDetalle, setInscripcionDetalle] = useState<Inscripcion | null>(null);
  
  // Estados para filtros
  const [filtroEscuela, setFiltroEscuela] = useState<string>('');
  const [filtroCinturon, setFiltroCinturon] = useState<string>('');
  const [filtroEdadMin, setFiltroEdadMin] = useState<string>('');
  const [filtroEdadMax, setFiltroEdadMax] = useState<string>('');
  
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Query para obtener todas las inscripciones
  const { data: inscripciones = [], isLoading } = useQuery({
    queryKey: ['inscripciones'],
    queryFn: async () => {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al cargar inscripciones');
      return response.json();
    },
  });

  // Query para obtener escuelas para el filtro
  const { data: escuelas = [] } = useQuery({
    queryKey: ['escuelas'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/escuelas');
      if (!response.ok) throw new Error('Error al cargar escuelas');
      return response.json();
    },
  });

  // Filtrar inscripciones
  const inscripcionesFiltradas = inscripciones.filter((inscripcion: Inscripcion) => {
    if (filtroEscuela && inscripcion.nombreEscuela !== filtroEscuela) {
      return false;
    }
    if (filtroCinturon && inscripcion.gradoCinturon !== filtroCinturon) {
      return false;
    }
    if (filtroEdadMin && inscripcion.edad < parseInt(filtroEdadMin)) {
      return false;
    }
    if (filtroEdadMax && inscripcion.edad > parseInt(filtroEdadMax)) {
      return false;
    }
    return true;
  });

  // Mutation para eliminar inscripción
  const eliminarMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar inscripción');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inscripciones'] });
      mostrarSnackbar('Inscripción eliminada correctamente', 'success');
    },
    onError: () => {
      mostrarSnackbar('Error al eliminar la inscripción', 'error');
    },
  });

  const mostrarSnackbar = (
    message: string,
    severity: 'success' | 'error' | 'info'
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleEliminarClick = (id: number) => {
    setInscripcionEliminar(id);
    setDeleteDialogOpen(true);
  };

  const handleEliminarConfirm = () => {
    if (inscripcionEliminar !== null) {
      eliminarMutation.mutate(inscripcionEliminar);
      setDeleteDialogOpen(false);
      setInscripcionEliminar(null);
    }
  };

  const handleEditar = (inscripcion: Inscripcion) => {
    navigate(`/inscripcion/editar/${inscripcion.id}`);
  };

  const handleVerDetalles = (inscripcion: Inscripcion) => {
    setInscripcionDetalle(inscripcion);
    setDetalleDialogOpen(true);
  };

  const handleNuevaInscripcion = () => {
    navigate('/inscripcion/nueva');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: (theme) => theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #f8fafc 100%)',
        py: 2,
      }}
    >
      <Container maxWidth="xl">
        {/* Theme Toggle */}
        <Box display="flex" justifyContent="flex-end" mb={1}>
          <ThemeToggle />
        </Box>

        {/* Header */}
        <Box mb={2} textAlign="center">
          <Typography
            variant="h3"
            sx={{
              background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 0.5,
            }}
          >
            Lista de Inscritos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestión Completa de Participantes del Torneo
          </Typography>
        </Box>

        {/* Actions Bar */}
        <Box mb={2} display="flex" gap={2} justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Button
            variant="outlined"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            size="small"
          >
            Volver
          </Button>
          <Box display="flex" gap={1.5} flexWrap="wrap">
            <Button
              variant="outlined"
              startIcon={<BarChartIcon />}
              onClick={() => navigate('/estadisticas')}
              size="small"
              sx={{
                borderColor: 'success.main',
                color: 'success.main',
                '&:hover': {
                  borderColor: 'success.dark',
                  bgcolor: 'rgba(16, 185, 129, 0.1)',
                },
              }}
            >
              Estadísticas
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleNuevaInscripcion}
              size="small"
            >
              Nueva Inscripción
            </Button>
            <Tooltip title="Actualizar lista">
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => queryClient.invalidateQueries({ queryKey: ['inscripciones'] })}
                size="small"
              >
                Actualizar
              </Button>
            </Tooltip>
          </Box>
        </Box>

        {/* Filtros */}
        <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
          <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
            <FilterListIcon color="primary" fontSize="small" />
            <Typography variant="subtitle1" color="primary" fontWeight={600}>
              Filtros
            </Typography>
            <Box flexGrow={1} />
            {(filtroEscuela || filtroCinturon || filtroEdadMin || filtroEdadMax) && (
              <Button
                startIcon={<ClearIcon />}
                onClick={() => {
                  setFiltroEscuela('');
                  setFiltroCinturon('');
                  setFiltroEdadMin('');
                  setFiltroEdadMax('');
                }}
                size="small"
              >
                Limpiar Filtros
              </Button>
            )}
          </Box>

          <Box display="flex" gap={1.5} flexWrap="wrap">
            <TextField
              select
              label="Escuela"
              value={filtroEscuela}
              onChange={(e) => setFiltroEscuela(e.target.value)}
              size="small"
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="">Todas</MenuItem>
              {escuelas.map((escuela: any) => (
                <MenuItem key={escuela.id} value={escuela.nombre || escuela.nombreEscuela}>
                  {escuela.nombre || escuela.nombreEscuela}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Cinturón"
              value={filtroCinturon}
              onChange={(e) => setFiltroCinturon(e.target.value)}
              size="small"
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="Cinta Blanca">Blanca</MenuItem>
              <MenuItem value="Cinta Amarilla">Amarilla</MenuItem>
              <MenuItem value="Cinta Naranja">Naranja</MenuItem>
              <MenuItem value="Cinta Verde">Verde</MenuItem>
              <MenuItem value="Cinta Azul">Azul</MenuItem>
              <MenuItem value="Cinta Roja">Roja</MenuItem>
              <MenuItem value="Cinta Roja-Negra">Roja-Negra</MenuItem>
              <MenuItem value="Cinta Negra 1° Dan">Negra 1° Dan</MenuItem>
              <MenuItem value="Cinta Negra 2° Dan">Negra 2° Dan</MenuItem>
              <MenuItem value="Cinta Negra 3° Dan">Negra 3° Dan</MenuItem>
            </TextField>

            <TextField
              label="Edad Mín"
              type="number"
              value={filtroEdadMin}
              onChange={(e) => setFiltroEdadMin(e.target.value)}
              size="small"
              sx={{ width: 100 }}
              inputProps={{ min: 5, max: 100 }}
            />

            <TextField
              label="Edad Máx"
              type="number"
              value={filtroEdadMax}
              onChange={(e) => setFiltroEdadMax(e.target.value)}
              size="small"
              sx={{ width: 100 }}
              inputProps={{ min: 5, max: 100 }}
            />
          </Box>

          {(filtroEscuela || filtroCinturon || filtroEdadMin || filtroEdadMax) && (
            <Box mt={2} display="flex" gap={1} flexWrap="wrap">
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1, alignSelf: 'center' }}>
                Filtros activos:
              </Typography>
              {filtroEscuela && (
                <Chip
                  label={`Escuela: ${filtroEscuela}`}
                  onDelete={() => setFiltroEscuela('')}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {filtroCinturon && (
                <Chip
                  label={`Cinturón: ${filtroCinturon}`}
                  onDelete={() => setFiltroCinturon('')}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {filtroEdadMin && (
                <Chip
                  label={`Edad mín: ${filtroEdadMin}`}
                  onDelete={() => setFiltroEdadMin('')}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {filtroEdadMax && (
                <Chip
                  label={`Edad máx: ${filtroEdadMax}`}
                  onDelete={() => setFiltroEdadMax('')}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1, alignSelf: 'center' }}>
                ({inscripcionesFiltradas.length} resultados)
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Tabla */}
        <TablaInscripciones
          inscripciones={inscripcionesFiltradas}
          onEditar={handleEditar}
          onEliminar={handleEliminarClick}
          onVerDetalles={handleVerDetalles}
          isLoading={isLoading}
        />

        {/* Details Dialog */}
        <DetalleInscripcion
          open={detalleDialogOpen}
          onClose={() => setDetalleDialogOpen(false)}
          inscripcion={inscripcionDetalle}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirmar eliminación</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro de que deseas eliminar esta inscripción? Esta acción no se puede deshacer.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEliminarConfirm} color="error" variant="contained">
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
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
