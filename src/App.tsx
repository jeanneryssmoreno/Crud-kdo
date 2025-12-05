import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import {
  CssBaseline,
} from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import InscritosPage from './pages/InscritosPage';
import InscripcionFormPage from './pages/InscripcionFormPage';
import EstadisticasPage from './pages/EstadisticasPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/inscritos" element={<InscritosPage />} />
            <Route path="/inscripcion/nueva" element={<InscripcionFormPage />} />
            <Route path="/inscripcion/editar/:id" element={<InscripcionFormPage />} />
            <Route path="/estadisticas" element={<EstadisticasPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
