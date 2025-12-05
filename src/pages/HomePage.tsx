import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  Paper,
  Card,
  CardContent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ListIcon from '@mui/icons-material/List';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

export default function HomePage() {
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
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="lg">
        {/* Theme Toggle */}
        <Box display="flex" justifyContent="flex-end" mb={1}>
          <ThemeToggle />
        </Box>
        {/* Header */}
        <Box mb={2} textAlign="center">
          <Typography
            variant="h2"
            sx={{
              background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 0.5,
            }}
          >
            Torneo de Taekwondo
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sistema de Inscripción y Gestión de Participantes
          </Typography>
        </Box>

        {/* Navigation Buttons */}
        <Box mb={2} display="flex" gap={1.5} justifyContent="center" flexWrap="wrap">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNuevaInscripcion}
            size="medium"
          >
            Nueva Inscripción
          </Button>
          <Button
            variant="outlined"
            startIcon={<ListIcon />}
            onClick={() => navigate('/inscritos')}
            size="medium"
          >
            Ver Inscritos
          </Button>
          <Button
            variant="outlined"
            startIcon={<BarChartIcon />}
            onClick={() => navigate('/estadisticas')}
            size="medium"
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
        </Box>

        {/* Welcome Card */}
        <Card
          sx={{
            maxWidth: 800,
            mx: 'auto',
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="h5" gutterBottom color="primary" textAlign="center">
              ¡Bienvenido al Sistema de Inscripción!
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" paragraph sx={{ mb: 2 }}>
              Gestiona las inscripciones para el torneo de Taekwondo de manera fácil y eficiente.
            </Typography>
            
            <Box mt={2}>
              <Typography variant="subtitle1" gutterBottom color="primary">
                ¿Qué puedes hacer aquí?
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'rgba(96, 165, 250, 0.1)', borderRadius: 2 }}>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  <li>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Inscribir nuevos alumnos</strong> - Registra participantes con toda su información
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Ver lista completa</strong> - Consulta todos los inscritos en una tabla organizada
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Editar inscripciones</strong> - Actualiza la información cuando sea necesario
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Ver detalles</strong> - Consulta información completa de cada participante
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Eliminar registros</strong> - Gestiona las inscripciones de forma segura
                    </Typography>
                  </li>
                </ul>
              </Paper>
            </Box>
          </CardContent>
        </Card>

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
