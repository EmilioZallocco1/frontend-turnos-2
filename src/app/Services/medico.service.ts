// src/app/medico.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  private apiUrl = `${environment.apiBaseUrl}/api/medicos`;

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
  return this.http.put(`${this.apiUrl}/${id}`, {
    sanitizedInput: medico
  });
}


  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
