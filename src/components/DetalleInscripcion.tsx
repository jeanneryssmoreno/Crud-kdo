import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Chip,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import CakeIcon from '@mui/icons-material/Cake';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Inscripcion } from '../types/Inscripcion';

interface DetalleInscripcionProps {
  open: boolean;
  onClose: () => void;
  inscripcion: Inscripcion | null;
}

export default function DetalleInscripcion({
  open,
  onClose,
  inscripcion,
}: DetalleInscripcionProps) {
  if (!inscripcion) return null;

  const getColorCinturon = (grado: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    if (!grado) return 'default';
    if (grado.includes('Blanca')) return 'default';
    if (grado.includes('Amarilla')) return 'warning';
    if (grado.includes('Naranja')) return 'warning';
    if (grado.includes('Verde')) return 'success';
    if (grado.includes('Azul')) return 'info';
    if (grado.includes('Roja')) return 'error';
    if (grado.includes('Negra')) return 'default';
    return 'default';
  };

  const formatFecha = (fecha?: string) => {
    if (!fecha) return 'No disponible';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const DetalleItem = ({ 
    icon, 
    label, 
    value 
  }: { 
    icon: React.ReactNode; 
    label: string; 
    value: string | number | undefined 
  }) => (
    <Box display="flex" alignItems="center" gap={2} py={1.5}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: 'primary.main',
          color: 'white',
        }}
      >
        {icon}
      </Box>
      <Box flex={1}>
        <Typography variant="caption" color="text.secondary" display="block">
          {label}
        </Typography>
        <Typography variant="body1" fontWeight={500}>
          {value || 'No especificado'}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <PersonIcon />
        Detalles de la Inscripción
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2 }}>
        {/* ID y Estado */}
        <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" color="text.secondary">
            ID: #{inscripcion.id}
          </Typography>
          <Chip 
            label={inscripcion.gradoCinturon} 
            color={getColorCinturon(inscripcion.gradoCinturon)}
            size="small"
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Información de la Escuela */}
        <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SchoolIcon /> Información de la Escuela
        </Typography>
        <DetalleItem
          icon={<SchoolIcon fontSize="small" />}
          label="Nombre de la Escuela"
          value={inscripcion.nombreEscuela}
        />

        <Divider sx={{ my: 3 }} />

        {/* Información Personal */}
        <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon /> Información Personal
        </Typography>
        <Box display="flex" flexDirection="column" gap={1}>
          <DetalleItem
            icon={<PersonIcon fontSize="small" />}
            label="Nombre Completo"
            value={`${inscripcion.nombreAlumno} ${inscripcion.apellidoAlumno}`}
          />
          <DetalleItem
            icon={<EmailIcon fontSize="small" />}
            label="Correo Electrónico"
            value={inscripcion.correoElectronico}
          />
          <Box display="flex" gap={2}>
            <Box flex={1}>
              <DetalleItem
                icon={<BadgeIcon fontSize="small" />}
                label="Tipo de Documento"
                value={inscripcion.tipoDocumento}
              />
            </Box>
            <Box flex={1}>
              <DetalleItem
                icon={<BadgeIcon fontSize="small" />}
                label="Número de Documento"
                value={inscripcion.documento}
              />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Información Física */}
        <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FitnessCenterIcon /> Información Física
        </Typography>
        <Box display="flex" gap={2}>
          <Box flex={1}>
            <DetalleItem
              icon={<CakeIcon fontSize="small" />}
              label="Edad"
              value={`${inscripcion.edad} años`}
            />
          </Box>
          <Box flex={1}>
            <DetalleItem
              icon={<FitnessCenterIcon fontSize="small" />}
              label="Peso"
              value={`${inscripcion.peso} kg`}
            />
          </Box>
          <Box flex={1}>
            <DetalleItem
              icon={<EmojiEventsIcon fontSize="small" />}
              label="Grado / Cinturón"
              value={inscripcion.gradoCinturon}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Información de Inscripción */}
        <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarTodayIcon /> Información de Inscripción
        </Typography>
        <DetalleItem
          icon={<CalendarTodayIcon fontSize="small" />}
          label="Fecha de Inscripción"
          value={formatFecha(inscripcion.fechaInscripcion)}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="contained" size="large">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
