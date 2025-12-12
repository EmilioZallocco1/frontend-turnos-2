export interface Turno {
  id: number;
  fecha: string;   // 'YYYY-MM-DD'
  hora: string;    // 'HH:mm'
  ocupado?: boolean;
  // paciente?: { id:number; nombre:string }; // solo si vas a mostrarlo
}
