// obra-social.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ObraSocialResponse } from './models/obra-social.interface';

@Injectable({
  providedIn: 'root'
})
export class ObraSocialService {
  private apiUrl = 'http://localhost:3000/api'; // URL base de tu API

  constructor(private http: HttpClient) {}

  // Método para obtener las obras sociales
  getObrasSociales(): Observable<ObraSocialResponse> {
    return this.http.get<ObraSocialResponse>(`${this.apiUrl}/obrasSocial`);
  }

  // Método para obtener los médicos
  getMedicos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/medicos`);
  }
}
