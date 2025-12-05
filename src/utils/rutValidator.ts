
export const formatRut = (rut: string): string => {
 
  const cleaned = rut.replace(/[^0-9kK]/g, '');
  
  if (cleaned.length === 0) return '';
  

  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1).toUpperCase();
  
  if (body.length === 0) return dv;
  

  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return `${formatted}-${dv}`;
};


export const cleanRut = (rut: string): string => {
  return rut.replace(/[^0-9kK]/g, '');
};

const calculateDV = (rut: string): string => {
  const cleaned = cleanRut(rut);
  const body = cleaned.slice(0, -1);
  
  let sum = 0;
  let multiplier = 2;
  
 
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const remainder = sum % 11;
  const dv = 11 - remainder;
  
  if (dv === 11) return '0';
  if (dv === 10) return 'K';
  return dv.toString();
};


export const validateRut = (rut: string): boolean => {
  if (!rut || rut.trim() === '') return false;
  
  const cleaned = cleanRut(rut);
  

  if (cleaned.length < 2) return false;
  
  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1).toUpperCase();
 
  if (!/^\d+$/.test(body)) return false;
  
  const calculatedDV = calculateDV(cleaned);
  
  return dv === calculatedDV;
};


export const getRutErrorMessage = (rut: string): string => {
  if (!rut || rut.trim() === '') {
    return 'El RUT es requerido';
  }
  
  const cleaned = cleanRut(rut);
  
  if (cleaned.length < 2) {
    return 'El RUT debe tener al menos 2 caracteres';
  }
  
  if (!validateRut(rut)) {
    return 'El RUT ingresado no es válido';
  }
  
  return '';
};
