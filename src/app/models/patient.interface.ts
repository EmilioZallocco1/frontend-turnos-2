export interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string | null;    
  role?: string;   
  obraSocial?: { nombre: string }; // Agrega otras propiedades según lo que esperes
}
