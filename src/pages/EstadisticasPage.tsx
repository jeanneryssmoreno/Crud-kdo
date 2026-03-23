import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import ThemeToggle from '../components/ThemeToggle';
import { Inscripcion } from '../types/Inscripcion';

const API_URL = 'http://localhost:3000/inscripciones';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#84cc16'];

export default function EstadisticasPage() {
  const navigate = useNavigate();

  const { data: inscripciones = [] } = useQuery({
    queryKey: ['inscripciones'],
    queryFn: async () => {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al cargar inscripciones');
      return response.json();
    },
  });

  const totalInscritos = inscripciones.length;


  const inscripcionesPorEscuela: Record<string, number> = inscripciones.reduce((acc: Record<string, number>, insc: Inscripcion) => {
    const escuela = insc.nombreEscuela || 'Sin escuela';
    acc[escuela] = (acc[escuela] || 0) + 1;
    return acc;
  }, {});

  const dataEscuelas = Object.entries(inscripcionesPorEscuela).map(([nombre, cantidad]) => ({
    nombre,
    cantidad: cantidad as number,
  }));

 
  const inscripcionesPorCinturon: Record<string, number> = inscripciones.reduce((acc: Record<string, number>, insc: Inscripcion) => {
    const cinturon = insc.gradoCinturon || 'Sin grado';
    acc[cinturon] = (acc[cinturon] || 0) + 1;
    return acc;
  }, {});

  const dataCinturones = Object.entries(inscripcionesPorCinturon).map(([nombre, cantidad]) => ({
    nombre: nombre.replace('Cinta ', ''),
    cantidad: cantidad as number,
  }));


  const distribucionEdad: Record<string, number> = inscripciones.reduce((acc: Record<string, number>, insc: Inscripcion) => {
    const edad = insc.edad;
    let rango = '';
    if (edad < 10) rango = '5-9 años';
    else if (edad < 15) rango = '10-14 años';
    else if (edad < 20) rango = '15-19 años';
    else if (edad < 30) rango = '20-29 años';
    else rango = '30+ años';
    
    acc[rango] = (acc[rango] || 0) + 1;
    return acc;
  }, {});

  const dataEdades = Object.entries(distribucionEdad).map(([rango, cantidad]) => ({
    rango,
    cantidad: cantidad as number,
  }));

  
  const promedioEdad = inscripciones.length > 0
    ? (inscripciones.reduce((sum: number, insc: Inscripcion) => sum + insc.edad, 0) / inscripciones.length).toFixed(1)
    : 0;


  const promedioPeso = inscripciones.length > 0
    ? (inscripciones.reduce((sum: number, insc: Inscripcion) => sum + insc.peso, 0) / inscripciones.length).toFixed(1)
    : 0;

 
  const escuelasUnicas = new Set(inscripciones.map((insc: Inscripcion) => insc.nombreEscuela)).size;

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
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Button
            variant="outlined"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            size="small"
          >
            Volver
          </Button>
          <ThemeToggle />
        </Box>

        <Box mb={2} textAlign="center">
          <Typography
            variant="h4"
            sx={{
              background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 0.5,
            }}
          >
            📊 Estadísticas del Torneo
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Análisis visual de las inscripciones
          </Typography>
        </Box>

        {/* Tarjetas de resumen */}
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 1.5,
            mb: 2 
          }}
        >
          <Card sx={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <PeopleIcon sx={{ fontSize: 32, color: 'white' }} />
                <Box>
                  <Typography variant="h5" color="white" fontWeight={700}>
                    {totalInscritos}
                  </Typography>
                  <Typography variant="caption" color="rgba(255,255,255,0.9)">
                    Total Inscritos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <SchoolIcon sx={{ fontSize: 32, color: 'white' }} />
                <Box>
                  <Typography variant="h5" color="white" fontWeight={700}>
                    {escuelasUnicas}
                  </Typography>
                  <Typography variant="caption" color="rgba(255,255,255,0.9)">
                    Escuelas
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <EmojiEventsIcon sx={{ fontSize: 32, color: 'white' }} />
                <Box>
                  <Typography variant="h5" color="white" fontWeight={700}>
                    {promedioEdad}
                  </Typography>
                  <Typography variant="caption" color="rgba(255,255,255,0.9)">
                    Edad Promedio
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <EmojiEventsIcon sx={{ fontSize: 32, color: 'white' }} />
                <Box>
                  <Typography variant="h5" color="white" fontWeight={700}>
                    {promedioPeso}
                  </Typography>
                  <Typography variant="caption" color="rgba(255,255,255,0.9)">
                    Peso Promedio (kg)
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Gráficos */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Primera fila - 2 gráficos lado a lado */}
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 2 
            }}
          >
            {/* Gráfico de barras - Inscripciones por Escuela */}
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle1" gutterBottom color="primary" fontWeight={600}>
                Inscripciones por Escuela
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={dataEscuelas}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cantidad" fill="#3b82f6" name="Inscritos" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>

            {/* Gráfico de pastel - Distribución por Cinturón */}
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle1" gutterBottom color="primary" fontWeight={600}>
                Distribución por Cinturón
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={dataCinturones}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.nombre} ${(entry.percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="cantidad"
                  >
                    {dataCinturones.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Box>

          {/* Segunda fila - Gráfico de edad ancho completo */}
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1" gutterBottom color="primary" fontWeight={600}>
              Distribución por Rango de Edad
            </Typography>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dataEdades}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rango" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cantidad" fill="#8b5cf6" name="Participantes" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}
