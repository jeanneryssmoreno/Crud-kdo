import { useState } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import FormularioInscripcion from './components/FormularioInscripcion';
import TablaInscripciones from './components/TablaInscripciones';
import { Inscripcion } from './types/Inscripcion';

const queryClient = new QueryClient();
const API_URL = 'http://localhost:3000/inscripciones';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CrudInscripciones />
    </QueryClientProvider>
  );
}

function CrudInscripciones() {
  const [tabActivo, setTabActivo] = useState<'formulario' | 'lista'>('formulario');
  const [inscripcionEditar, setInscripcionEditar] = useState<Inscripcion | null>(null);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'exito' | 'error' } | null>(null);
  
  const queryClient = useQueryClient();

  // Query para obtener todas las inscripciones
  const { data: inscripciones = [], isLoading } = useQuery({
    queryKey: ['inscripciones'],
    queryFn: async () => {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al cargar inscripciones');
      return response.json();
    }
  });

  // Mutation para crear inscripción
  const crearMutation = useMutation({
    mutationFn: async (nuevaInscripcion: Inscripcion) => {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...nuevaInscripcion,
          fechaInscripcion: new Date().toISOString()
        })
      });
      if (!response.ok) throw new Error('Error al crear inscripción');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inscripciones'] });
      mostrarMensaje('✅ Alumno inscrito correctamente', 'exito');
      setTabActivo('lista');
    },
    onError: () => {
      mostrarMensaje('❌ Error al guardar la inscripción', 'error');
    }
  });

  // Mutation para actualizar inscripción
  const actualizarMutation = useMutation({
    mutationFn: async (inscripcion: Inscripcion) => {
      const response = await fetch(`${API_URL}/${inscripcion.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inscripcion)
      });
      if (!response.ok) throw new Error('Error al actualizar inscripción');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inscripciones'] });
      mostrarMensaje('✅ Inscripción actualizada correctamente', 'exito');
      setInscripcionEditar(null);
      setTabActivo('lista');
    },
    onError: () => {
      mostrarMensaje('❌ Error al actualizar la inscripción', 'error');
    }
  });

  // Mutation para eliminar inscripción
  const eliminarMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Error al eliminar inscripción');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inscripciones'] });
      mostrarMensaje('✅ Inscripción eliminada correctamente', 'exito');
    },
    onError: () => {
      mostrarMensaje('❌ Error al eliminar la inscripción', 'error');
    }
  });

  const mostrarMensaje = (texto: string, tipo: 'exito' | 'error') => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 5000);
  };

  const handleSubmit = (inscripcion: Inscripcion) => {
    if (inscripcionEditar) {
      actualizarMutation.mutate({ ...inscripcion, id: inscripcionEditar.id });
    } else {
      crearMutation.mutate(inscripcion);
    }
  };

  const handleEditar = (inscripcion: Inscripcion) => {
    setInscripcionEditar(inscripcion);
    setTabActivo('formulario');
    mostrarMensaje('📝 Editando inscripción. Modifica los datos y guarda.', 'exito');
  };

  const handleCancelar = () => {
    setInscripcionEditar(null);
  };

  const handleEliminar = (id: number) => {
    eliminarMutation.mutate(id);
  };

  return (
    <div>
      <h1>🥋 Torneo de Taekwondo</h1>
      <p>Sistema de Inscripción y Gestión de Participantes</p>

      {mensaje && (
        <div className={mensaje.tipo}>
          {mensaje.texto}
        </div>
      )}

      <div>
        <button 
          onClick={() => setTabActivo('formulario')}
          className={tabActivo === 'formulario' ? 'active' : ''}
        >
          Nueva Inscripción
        </button>
        <button 
          onClick={() => setTabActivo('lista')}
          className={tabActivo === 'lista' ? 'active' : ''}
        >
          Lista de Inscritos
        </button>
      </div>

      {tabActivo === 'formulario' && (
        <div>
          <FormularioInscripcion
            onSubmit={handleSubmit}
            inscripcionEditar={inscripcionEditar}
            onCancelar={handleCancelar}
          />
        </div>
      )}

      {tabActivo === 'lista' && (
        <div>
          <button onClick={() => queryClient.invalidateQueries({ queryKey: ['inscripciones'] })}>
            🔄 Actualizar Lista
          </button>
          <TablaInscripciones
            inscripciones={inscripciones}
            onEditar={handleEditar}
            onEliminar={handleEliminar}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
}

export default App;
