import { useState, useEffect } from 'react';
import { Inscripcion } from '../types/Inscripcion';

interface FormularioInscripcionProps {
  onSubmit: (inscripcion: Inscripcion) => void;
  inscripcionEditar?: Inscripcion | null;
  onCancelar?: () => void;
}

export default function FormularioInscripcion({ 
  onSubmit, 
  inscripcionEditar, 
  onCancelar 
}: FormularioInscripcionProps) {
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

  // Actualizar formulario cuando se edita
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
  }, [inscripcionEditar]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'edad' || name === 'peso' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Limpiar formulario después de enviar
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
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="nombreEscuela">Nombre de Escuela *</label>
        <input
          type="text"
          id="nombreEscuela"
          name="nombreEscuela"
          value={formData.nombreEscuela}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="nombreAlumno">Nombre del Alumno *</label>
        <input
          type="text"
          id="nombreAlumno"
          name="nombreAlumno"
          value={formData.nombreAlumno}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="apellidoAlumno">Apellido del Alumno *</label>
        <input
          type="text"
          id="apellidoAlumno"
          name="apellidoAlumno"
          value={formData.apellidoAlumno}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="tipoDocumento">Tipo de Documento *</label>
        <select
          id="tipoDocumento"
          name="tipoDocumento"
          value={formData.tipoDocumento}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione...</option>
          <option value="RUT">RUT</option>
          <option value="Pasaporte">Pasaporte</option>
          <option value="DNI">DNI</option>
        </select>
      </div>

      <div>
        <label htmlFor="documento">RUT / Pasaporte / DNI *</label>
        <input
          type="text"
          id="documento"
          name="documento"
          value={formData.documento}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="correoElectronico">Correo Electrónico *</label>
        <input
          type="email"
          id="correoElectronico"
          name="correoElectronico"
          value={formData.correoElectronico}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="edad">Edad *</label>
        <input
          type="number"
          id="edad"
          name="edad"
          value={formData.edad || ''}
          onChange={handleChange}
          min="5"
          max="100"
          required
        />
      </div>

      <div>
        <label htmlFor="peso">Peso (kg) *</label>
        <input
          type="number"
          id="peso"
          name="peso"
          value={formData.peso || ''}
          onChange={handleChange}
          step="0.1"
          min="20"
          max="200"
          required
        />
      </div>

      <div>
        <label htmlFor="gradoCinturon">Grado / Cinturón *</label>
        <select
          id="gradoCinturon"
          name="gradoCinturon"
          value={formData.gradoCinturon}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione...</option>
          <option value="Cinta Blanca">Cinta Blanca</option>
          <option value="Cinta Amarilla">Cinta Amarilla</option>
          <option value="Cinta Naranja">Cinta Naranja</option>
          <option value="Cinta Verde">Cinta Verde</option>
          <option value="Cinta Azul">Cinta Azul</option>
          <option value="Cinta Roja">Cinta Roja</option>
          <option value="Cinta Roja-Negra">Cinta Roja-Negra</option>
          <option value="Cinta Negra 1° Dan">Cinta Negra 1° Dan</option>
          <option value="Cinta Negra 2° Dan">Cinta Negra 2° Dan</option>
          <option value="Cinta Negra 3° Dan">Cinta Negra 3° Dan</option>
        </select>
      </div>

      <div>
        <button type="submit">
          {inscripcionEditar ? 'Actualizar' : 'Inscribir Alumno'}
        </button>
        {inscripcionEditar && onCancelar && (
          <button type="button" onClick={onCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
