import { Inscripcion } from '../types/Inscripcion';

interface TablaInscripcionesProps {
  inscripciones: Inscripcion[];
  onEditar: (inscripcion: Inscripcion) => void;
  onEliminar: (id: number) => void;
  isLoading: boolean;
}

export default function TablaInscripciones({ 
  inscripciones, 
  onEditar, 
  onEliminar,
  isLoading 
}: TablaInscripcionesProps) {
  
  if (isLoading) {
    return <div>Cargando inscripciones...</div>;
  }

  if (inscripciones.length === 0) {
    return (
      <div>
        <p>📋 No hay inscripciones todavía</p>
        <p>Comienza agregando un nuevo alumno</p>
      </div>
    );
  }

  const handleEliminar = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta inscripción?')) {
      onEliminar(id);
    }
  };

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Escuela</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Documento</th>
          <th>Email</th>
          <th>Edad</th>
          <th>Peso (kg)</th>
          <th>Grado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {inscripciones.map((inscripcion) => (
          <tr key={inscripcion.id}>
            <td>{inscripcion.id}</td>
            <td>{inscripcion.nombreEscuela}</td>
            <td>{inscripcion.nombreAlumno}</td>
            <td>{inscripcion.apellidoAlumno}</td>
            <td>{inscripcion.tipoDocumento}: {inscripcion.documento}</td>
            <td>{inscripcion.correoElectronico}</td>
            <td>{inscripcion.edad}</td>
            <td>{inscripcion.peso}</td>
            <td>{inscripcion.gradoCinturon}</td>
            <td>
              <div>
                <button onClick={() => onEditar(inscripcion)}>
                  ✏️ Editar
                </button>
                <button onClick={() => inscripcion.id && handleEliminar(inscripcion.id)}>
                  🗑️ Eliminar
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
