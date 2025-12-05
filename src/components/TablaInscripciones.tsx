import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography,
  TextField,
  InputAdornment,
  TablePagination,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Inscripcion } from '../types/Inscripcion';

interface TablaInscripcionesProps {
  inscripciones: Inscripcion[];
  onEditar: (inscripcion: Inscripcion) => void;
  onEliminar: (id: number) => void;
  onVerDetalles: (inscripcion: Inscripcion) => void;
  isLoading: boolean;
}

export default function TablaInscripciones({
  inscripciones,
  onEditar,
  onEliminar,
  onVerDetalles,
  isLoading,
}: TablaInscripcionesProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [busqueda, setBusqueda] = useState('');

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Validación robusta
  const listaSegura = Array.isArray(inscripciones) ? inscripciones : [];

  const inscripcionesFiltradas = listaSegura.filter((inscripcion) => {
    const searchLower = busqueda.toLowerCase();
    return (
      (inscripcion.nombreEscuela?.toLowerCase() || '').includes(searchLower) ||
      (inscripcion.nombreAlumno?.toLowerCase() || '').includes(searchLower) ||
      (inscripcion.apellidoAlumno?.toLowerCase() || '').includes(searchLower) ||
      (inscripcion.documento?.toLowerCase() || '').includes(searchLower) ||
      (inscripcion.correoElectronico?.toLowerCase() || '').includes(searchLower)
    );
  });

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

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (listaSegura.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No hay inscripciones todavía
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Comienza agregando un nuevo alumno usando el botón "Nueva Inscripción"
        </Typography>
      </Box>
    );
  }

  // Paginación con filtro
  const inscripcionesPaginadas = inscripcionesFiltradas.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Box mb={3} display="flex" justifyContent="flex-end">
        <TextField
          placeholder="Buscar..."
          variant="outlined"
          size="small"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Escuela</TableCell>
              <TableCell>Nombre Completo</TableCell>
              <TableCell>Documento</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="center">Edad</TableCell>
              <TableCell align="center">Peso (kg)</TableCell>
              <TableCell>Grado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inscripcionesPaginadas.map((inscripcion) => (
              <TableRow
                key={inscripcion.id}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(59, 130, 246, 0.08)',
                  },
                }}
              >
                <TableCell>{inscripcion.id}</TableCell>
                <TableCell>{inscripcion.nombreEscuela}</TableCell>
                <TableCell>
                  {inscripcion.nombreAlumno} {inscripcion.apellidoAlumno}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {inscripcion.tipoDocumento}
                  </Typography>
                  <Typography variant="body2">{inscripcion.documento}</Typography>
                </TableCell>
                <TableCell>{inscripcion.correoElectronico}</TableCell>
                <TableCell align="center">{inscripcion.edad}</TableCell>
                <TableCell align="center">{inscripcion.peso}</TableCell>
                <TableCell>
                  <Chip
                    label={inscripcion.gradoCinturon}
                    color={getColorCinturon(inscripcion.gradoCinturon)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Box display="flex" gap={1} justifyContent="center">
                    <Tooltip title="Ver Detalles">
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => onVerDetalles(inscripcion)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onEditar(inscripcion)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => inscripcion.id && onEliminar(inscripcion.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={inscripcionesFiltradas.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
          mt: 2,
        }}
      />
    </Box>
  );
}
