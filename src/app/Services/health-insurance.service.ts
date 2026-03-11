// obra-social.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ObraSocialResponse } from 'src/app/models/health-insurance.interface';
import { ObraSocial } from 'src/app/models/health-insurance.interface';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


export interface PaginatedObraSocialResponse {
  message: string;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: ObraSocial[];
}

@Injectable({
  providedIn: 'root'
})
export class ObraSocialService {
  private apiUrl = `${environment.apiBaseUrl}/api/obras-sociales`;
; // URL base de tu API

  constructor(private http: HttpClient) {}

  // Método para obtener las obras sociales
  getObrasSociales(page:number = 1, limit:number = 10): Observable<ObraSocialResponse> {
    const params = new HttpParams()
    .set('page', page.toString())
    .set('limit', limit.toString());
    
    return this.http.get<ObraSocialResponse>(`${this.apiUrl}`, { params });
  }

  // Método para obtener los médicos
  getMedicos(): Observable<any> {
    return this.http.get<any>(`${environment.apiBaseUrl}/api/medicos`);
  }


  create(payload: Pick<ObraSocial, 'nombre'>): Observable<ObraSocial> {
    return this.http.post<{message: string; data: ObraSocial}>(this.apiUrl, payload)
      .pipe(map(r => r.data));
  }

 register(obraSocial: any): Observable<any> {
    return this.http.post(this.apiUrl, obraSocial);
  }

  listar(page: number = 1, limit: number = 10): Observable<PaginatedObraSocialResponse> {
    const params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    return this.http.get<PaginatedObraSocialResponse>(this.apiUrl, { params });
  }



}


