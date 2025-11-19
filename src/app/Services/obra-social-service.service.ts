// obra-social.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ObraSocialResponse } from 'src/app/models/obra-social.interface';
import { ObraSocial } from 'src/app/models/obra-social.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ObraSocialService {
  private apiUrl = 'http://localhost:3000/api/obras-sociales'; // URL base de tu API

  constructor(private http: HttpClient) {}

  // Método para obtener las obras sociales
  getObrasSociales(): Observable<ObraSocialResponse> {
    return this.http.get<ObraSocialResponse>(`${this.apiUrl}`);
  }

  // Método para obtener los médicos
  getMedicos(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/api/medicos');
  }


  crear(payload: Pick<ObraSocial, 'nombre'>): Observable<ObraSocial> {
    return this.http.post<{message: string; data: ObraSocial}>(this.apiUrl, payload)
      .pipe(map(r => r.data));
  }

 registrar(obraSocial: any): Observable<any> {
    return this.http.post(this.apiUrl, obraSocial);
  }

  listar(): Observable<ObraSocial[]> {
    return this.http.get<{message: string; data: ObraSocial[]}>(this.apiUrl)
      .pipe(map(r => r.data));
  }



}


