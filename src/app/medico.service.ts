// src/app/medico.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  private apiUrl = 'http://localhost:3000/api/medicos'; // Ajusta si cambia tu endpoint

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  registrar(medico: any): Observable<any> {
    return this.http.post(this.apiUrl, medico);
  }

  actualizar(id: number, medico: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, medico);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
