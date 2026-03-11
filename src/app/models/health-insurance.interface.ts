// obra-social.interface.ts
export interface ObraSocial {
    id: number;
    nombre: string;
  }
  
  export interface ObraSocialResponse {
    data: ObraSocial[];
    message: string;
  }
  

export interface PaginatedObraSocialResponse {
  message: string;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: ObraSocial[];
}