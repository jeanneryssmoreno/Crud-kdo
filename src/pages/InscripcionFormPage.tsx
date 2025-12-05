import { useState, useEffect } from 'react';
import {
  useMutation,
  useQueryClient,
  useQuery,
} from '@tanstack/react-query';
import {
  Container,
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  Paper,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { Inscripcion } from '../types/Inscripcion';
import { formatRut, validateRut, getRutErrorMessage } from '../utils/rutValidator';

const API_URL = 'http://localhost:3000/inscripciones';

export default function InscripcionFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [formData, setFormData] = useState<Inscripcion>({
    nombreEscuela: '',
    nombreAlumno: '',
    apellidoAlumno: '',
    tipoDocumento: '',
    documento: '',
    correoElectronico: '',
    edad: 0,
    peso: 0,
    gradoCinturon: '',
  });

  const [mostrarNuevaEscuela, setMostrarNuevaEscuela] = useState(false);
  const [nuevaEscuela, setNuevaEscuela] = useState('');
  const [rutError, setRutError] = useState('');

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Query para obtener datos si estamos editando
  const { data: inscripcionData } = useQuery({
    queryKey: ['inscripcion', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error('Error al cargar inscripción');
      return response.json();
    },
    enabled: !!id,
  });

  // Query para obtener las escuelas desde la API
  const { data: escuelas = [] } = useQuery({
    queryKey: ['escuelas'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/escuelas');
      if (!response.ok) throw new Error('Error al cargar escuelas');
      return response.json();
    },
  });

  // Mutation para crear nueva escuela
  const crearEscuelaMutation = useMutation({
    mutationFn: async (nombreEscuela: string) => {
      const response = await fetch('http://localhost:3000/escuelas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombreEscuela }),
      });
      if (!response.ok) throw new Error('Error al crear escuela');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['escuelas'] });
      setFormData(prev => ({ ...prev, nombreEscuela: data.nombre }));
      setMostrarNuevaEscuela(false);
      setNuevaEscuela('');
      mostrarSnackbar('Escuela creada correctamente', 'success');
    },
    onError: () => {
      mostrarSnackbar('Error al crear la escuela', 'error');
    },
  });

  // Actualizar formulario cuando se carguen los datos
  useEffect(() => {
    if (inscripcionData) {
      setFormData(inscripcionData);
    }
  }, [inscripcionData]);

  // Mutation para crear inscripción
  const crearMutation = useMutation({
    mutationFn: async (nuevaInscripcion: Inscripcion) => {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...nuevaInscripcion,
          fechaInscripcion: new Date().toISOString(),
        }),
      });
      if (!response.ok) throw new Error('Error al crear inscripción');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inscripciones'] });
      mostrarSnackbar('Alumno inscrito correctamente', 'success');
      setTimeout(() => navigate('/inscritos'), 1500);
    },
    onError: () => {
      mostrarSnackbar('Error al guardar la inscripción', 'error');
    },
  });

  // Mutation para actualizar inscripción
  const actualizarMutation = useMutation({
    mutationFn: async (inscripcion: Inscripcion) => {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inscripcion),
      });
      if (!response.ok) throw new Error('Error al actualizar inscripción');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inscripciones'] });
      mostrarSnackbar('Inscripción actualizada correctamente', 'success');
      setTimeout(() => navigate('/inscritos'), 1500);
    },
    onError: () => {
      mostrarSnackbar('Error al actualizar la inscripción', 'error');
    },
  });

  const mostrarSnackbar = (
    message: string,
    severity: 'success' | 'error' | 'info'
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Si selecciona "nueva escuela"
    if (name === 'nombreEscuela' && value === '__nueva__') {
      setMostrarNuevaEscuela(true);
      return;
    }
    
    // Si es el campo de documento y el tipo es RUT, formatear y validar
    if (name === 'documento' && formData.tipoDocumento === 'RUT') {
      const formatted = formatRut(value);
      setFormData((prev) => ({
        ...prev,
        documento: formatted,
      }));
      
      // Validar RUT solo si tiene contenido
      if (formatted.length > 0) {
        const errorMsg = getRutErrorMessage(formatted);
        setRutError(errorMsg);
      } else {
        setRutError('');
      }
      return;
    }
    
    // Limpiar error de RUT si cambia el tipo de documento
    if (name === 'tipoDocumento') {
      setRutError('');
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'edad' || name === 'peso' ? Number(value) : value,
    }));
  };

  const handleGuardarNuevaEscuela = () => {
    if (nuevaEscuela.trim()) {
      crearEscuelaMutation.mutate(nuevaEscuela.trim());
    }
  };

  const handleCancelarNuevaEscuela = () => {
    setMostrarNuevaEscuela(false);
    setNuevaEscuela('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar RUT si el tipo de documento es RUT
    if (formData.tipoDocumento === 'RUT') {
      if (!validateRut(formData.documento)) {
        setRutError(getRutErrorMessage(formData.documento));
        mostrarSnackbar('Por favor, ingresa un RUT válido', 'error');
        return;
      }
    }
    
    if (isEditing) {
      actualizarMutation.mutate(formData);
    } else {
      crearMutation.mutate(formData);
    }
  };

  const handleCancel = () => {
    navigate(-1);
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
      <Container maxWidth="lg">
        {/* Theme Toggle */}
        <Box display="flex" justifyContent="flex-end" mb={1}>
          <ThemeToggle />
        </Box>
        {/* Header */}
        <Box mb={2}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mb: 1, color: 'text.secondary' }}
            size="small"
          >
            Volver
          </Button>
          <Typography
            variant="h3"
            sx={{
              background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 0.5,
              textAlign: 'center',
            }}
          >
            {isEditing ? 'Editar Inscripción' : 'Nueva Inscripción'}
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            {isEditing
              ? 'Actualiza los datos del participante'
              : 'Completa el formulario para inscribir un nuevo participante'}
          </Typography>
        </Box>

        {/* Formulario */}
        <Paper
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 3,
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box display="flex" flexDirection="column" gap={2}>
            {/* Información de la Escuela */}
            <Box>
              <Typography variant="subtitle1" gutterBottom color="primary" sx={{ mb: 1 }}>
                Información de la Escuela
              </Typography>
              <TextField
                fullWidth
                select
                label="Nombre de Escuela"
                name="nombreEscuela"
                value={formData.nombreEscuela}
                onChange={handleChange}
                required
                size="small"
                helperText={escuelas.length === 0 ? "Cargando escuelas..." : "Selecciona una escuela de la lista"}
              >
                <MenuItem value="" disabled>
                  Seleccione una escuela...
                </MenuItem>
                {escuelas.map((escuela: any) => (
                  <MenuItem key={escuela.id} value={escuela.nombre || escuela.nombreEscuela}>
                    {escuela.nombre || escuela.nombreEscuela}
                  </MenuItem>
                ))}
                <MenuItem value="__nueva__" sx={{ fontStyle: 'italic', color: 'primary.main', borderTop: 1, borderColor: 'divider', mt: 1, pt: 1 }}>
                  ➕ Agregar nueva escuela
                </MenuItem>
              </TextField>
            </Box>

            {/* Información Personal */}
            <Box>
              <Typography variant="subtitle1" gutterBottom color="primary" sx={{ mb: 1 }}>
                Información Personal
              </Typography>
              <Box display="flex" flexDirection="column" gap={1.5}>
                <Box display="flex" gap={2}>
                  <TextField
                    fullWidth
                    label="Nombre del Alumno"
                    name="nombreAlumno"
                    value={formData.nombreAlumno}
                    onChange={handleChange}
                    required
                    size="small"
                  />
                  <TextField
                    fullWidth
                    label="Apellido del Alumno"
                    name="apellidoAlumno"
                    value={formData.apellidoAlumno}
                    onChange={handleChange}
                    required
                    size="small"
                  />
                </Box>

                <TextField
                  fullWidth
                  label="Correo Electrónico"
                  name="correoElectronico"
                  type="email"
                  value={formData.correoElectronico}
                  onChange={handleChange}
                  required
                  size="small"
                />

                <Box display="flex" gap={2}>
                  <TextField
                    fullWidth
                    select
                    label="Tipo de Documento"
                    name="tipoDocumento"
                    value={formData.tipoDocumento}
                    onChange={handleChange}
                    required
                    size="small"
                  >
                    <MenuItem value="">Seleccione...</MenuItem>
                    <MenuItem value="RUT">RUT</MenuItem>
                    <MenuItem value="Pasaporte">Pasaporte</MenuItem>
                    <MenuItem value="DNI">DNI</MenuItem>
                  </TextField>
                  <TextField
                    fullWidth
                    label={formData.tipoDocumento === 'RUT' ? 'RUT' : 'Número de Documento'}
                    name="documento"
                    value={formData.documento}
                    onChange={handleChange}
                    required
                    size="small"
                    error={formData.tipoDocumento === 'RUT' && !!rutError}
                    helperText={formData.tipoDocumento === 'RUT' ? (rutError || 'Formato: 12.345.678-9') : ''}
                    placeholder={formData.tipoDocumento === 'RUT' ? '12.345.678-9' : ''}
                  />
                </Box>
              </Box>
            </Box>

            {/* Información Física y Deportiva */}
            <Box>
              <Typography variant="subtitle1" gutterBottom color="primary" sx={{ mb: 1 }}>
                Información Física y Deportiva
              </Typography>
              <Box display="flex" flexDirection="column" gap={1.5}>
                <Box display="flex" gap={2}>
                  <TextField
                    fullWidth
                    label="Edad"
                    name="edad"
                    type="number"
                    value={formData.edad || ''}
                    onChange={handleChange}
                    inputProps={{ min: 5, max: 100 }}
                    required
                    size="small"
                  />
                  <TextField
                    fullWidth
                    label="Peso (kg)"
                    name="peso"
                    type="number"
                    value={formData.peso || ''}
                    onChange={handleChange}
                    inputProps={{ min: 20, max: 200, step: 0.1 }}
                    required
                    size="small"
                  />
                  <TextField
                    fullWidth
                    select
                    label="Grado / Cinturón"
                    name="gradoCinturon"
                    value={formData.gradoCinturon}
                    onChange={handleChange}
                    required
                    size="small"
                  >
                    <MenuItem value="">Seleccione...</MenuItem>
                    <MenuItem value="Cinta Blanca">Cinta Blanca</MenuItem>
                    <MenuItem value="Cinta Amarilla">Cinta Amarilla</MenuItem>
                    <MenuItem value="Cinta Naranja">Cinta Naranja</MenuItem>
                    <MenuItem value="Cinta Verde">Cinta Verde</MenuItem>
                    <MenuItem value="Cinta Azul">Cinta Azul</MenuItem>
                    <MenuItem value="Cinta Roja">Cinta Roja</MenuItem>
                    <MenuItem value="Cinta Roja-Negra">Cinta Roja-Negra</MenuItem>
                    <MenuItem value="Cinta Negra 1° Dan">Cinta Negra 1° Dan</MenuItem>
                    <MenuItem value="Cinta Negra 2° Dan">Cinta Negra 2° Dan</MenuItem>
                    <MenuItem value="Cinta Negra 3° Dan">Cinta Negra 3° Dan</MenuItem>
                  </TextField>
                </Box>
              </Box>
            </Box>

            {/* Botones */}
            <Box display="flex" gap={2} justifyContent="flex-end" mt={1}>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                size="medium"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                size="medium"
                disabled={crearMutation.isPending || actualizarMutation.isPending}
              >
                {isEditing ? 'Actualizar' : 'Inscribir Alumno'}
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Dialog para agregar nueva escuela */}
        <Dialog open={mostrarNuevaEscuela} onClose={handleCancelarNuevaEscuela} maxWidth="sm" fullWidth>
          <DialogTitle>Agregar Nueva Escuela</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nombre de la Escuela"
              type="text"
              fullWidth
              value={nuevaEscuela}
              onChange={(e) => setNuevaEscuela(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && nuevaEscuela.trim()) {
                  handleGuardarNuevaEscuela();
                }
              }}
              placeholder="Ej: Escuela de Taekwondo Dragon"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelarNuevaEscuela}>
              Cancelar
            </Button>
            <Button 
              onClick={handleGuardarNuevaEscuela} 
              variant="contained"
              disabled={!nuevaEscuela.trim() || crearEscuelaMutation.isPending}
            >
              {crearEscuelaMutation.isPending ? 'Guardando...' : 'Guardar'}
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
