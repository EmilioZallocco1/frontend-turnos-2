// obra-social.interface.ts
export interface ObraSocial {
    id: number;
    nombre: string;
  }
  
  export interface ObraSocialResponse {
    data: ObraSocial[];
    message: string;
  }
  