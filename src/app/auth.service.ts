import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; // URL base de tu API

  constructor(private http: HttpClient) {}

  // Método de login para pacientes
  login(email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/pacientes/login`; // URL para el login de pacientes
    const body = { email, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(url, body, { headers })
      .pipe(
        catchError(err => {
          return throwError(err.error.message || 'Error en el servidor');
        })
      );
  }

  // Método de registro para pacientes
  register(nombre: string, apellido: string, email: string, password: string, obraSocialId: number): Observable<any> {
    const body = { nombre, apellido, email, password, obraSocialId };
    return this.http.post<any>(`${this.apiUrl}/pacientes/register`, body) // Cambia la ruta si es necesario
      .pipe(
        catchError(err => {
          return throwError(err.error.message || 'Error en el servidor');
        })
      );
  }
}
