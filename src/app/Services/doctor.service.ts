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

  getAll(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  register(medico: any): Observable<any> {
    return this.http.post(this.apiUrl, medico);
  }

 update(id: number, medico: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, {
    sanitizedInput: medico
  });
}


  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
