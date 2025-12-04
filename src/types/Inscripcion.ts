export interface Inscripcion {
  id?: number;
  nombreEscuela: string;
  nombreAlumno: string;
  apellidoAlumno: string;
  tipoDocumento: 'RUT' | 'Pasaporte' | 'DNI' | '';
  documento: string;
  correoElectronico: string;
  edad: number;
  peso: number;
  gradoCinturon: string;
  fechaInscripcion?: string;
}
