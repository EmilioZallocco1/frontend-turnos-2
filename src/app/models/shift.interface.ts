export interface Paciente {
  id: number;
  nombre: string;
  apellido?: string;
  email?: string;
}

export interface Medico {
  id: number;
  nombre: string;
  email?: string;
  especialidad?: {
    id: number;
    name: string;
  };
}

export interface Turno {
  id: number;
  fecha: string;
  hora: string;
  estado: string;
  paciente?: Paciente;
  medico?: Medico;
}

export interface TurnoResponse {
  message: string;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: Turno[];
}