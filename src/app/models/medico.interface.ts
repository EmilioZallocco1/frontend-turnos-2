import { Especialidad } from './especialidad.interface';
import { ObraSocial } from './health-insurance.interface.js';

export interface Medico {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  activo: boolean;
  especialidad: Especialidad;
  obraSocial?: ObraSocial | null;
}