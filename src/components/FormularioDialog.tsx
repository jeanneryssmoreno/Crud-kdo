import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Inscripcion } from '../types/Inscripcion';

interface FormularioDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (inscripcion: Inscripcion) => void;
  inscripcionEditar?: Inscripcion | null;
}

const gradosCinturon = [
  'Cinta Blanca',
  'Cinta Amarilla',
  'Cinta Naranja',
  'Cinta Verde',
  'Cinta Azul',
  'Cinta Roja',
  'Cinta Roja-Negra',
  'Cinta Negra 1° Dan',
  'Cinta Negra 2° Dan',
  'Cinta Negra 3° Dan',
];

const tiposDocumento = ['RUT', 'Pasaporte', 'DNI'];

export default function FormularioDialog({
  open,
  onClose,
  onSubmit,
  inscripcionEditar,
}: FormularioDialogProps) {
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

  useEffect(() => {
    if (inscripcionEditar) {
      setFormData(inscripcionEditar);
    } else {
      setFormData({
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
    }
  }, [inscripcionEditar, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'edad' || name === 'peso' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
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
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          {inscripcionEditar ? 'Editar Inscripción' : 'Nueva Inscripción'}
        </Box>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: 3,
            }}
          >
            <Box>
              <TextField
                fullWidth
                label="Nombre de Escuela"
                name="nombreEscuela"
                value={formData.nombreEscuela}
                onChange={handleChange}
                required
              />
            </Box>

            <Box>
              <TextField
                fullWidth
                label="Nombre del Alumno"
                name="nombreAlumno"
                value={formData.nombreAlumno}
                onChange={handleChange}
                required
              />
            </Box>

            <Box>
              <TextField
                fullWidth
                label="Apellido del Alumno"
                name="apellidoAlumno"
                value={formData.apellidoAlumno}
                onChange={handleChange}
                required
              />
            </Box>

            <Box>
              <TextField
                fullWidth
                select
                label="Tipo de Documento"
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleChange}
                required
              >
                {tiposDocumento.map((tipo) => (
                  <MenuItem key={tipo} value={tipo}>
                    {tipo}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box>
              <TextField
                fullWidth
                label="Número de Documento"
                name="documento"
                value={formData.documento}
                onChange={handleChange}
                required
              />
            </Box>

            <Box>
              <TextField
                fullWidth
                type="email"
                label="Correo Electrónico"
                name="correoElectronico"
                value={formData.correoElectronico}
                onChange={handleChange}
                required
              />
            </Box>

            <Box>
              <TextField
                fullWidth
                type="number"
                label="Edad"
                name="edad"
                value={formData.edad || ''}
                onChange={handleChange}
                inputProps={{ min: 5, max: 100 }}
                required
              />
            </Box>

            <Box>
              <TextField
                fullWidth
                type="number"
                label="Peso (kg)"
                name="peso"
                value={formData.peso || ''}
                onChange={handleChange}
                inputProps={{ min: 20, max: 200, step: 0.1 }}
                required
              />
            </Box>

            <Box>
              <TextField
                fullWidth
                select
                label="Grado / Cinturón"
                name="gradoCinturon"
                value={formData.gradoCinturon}
                onChange={handleChange}
                required
              >
                {gradosCinturon.map((grado) => (
                  <MenuItem key={grado} value={grado}>
                    {grado}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleClose} variant="outlined" color="inherit">
            Cancelar
          </Button>
          <Button type="submit" variant="contained">
            {inscripcionEditar ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
