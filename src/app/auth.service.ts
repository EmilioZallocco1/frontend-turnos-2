import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/pacientes'; // URL base de tu API

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/login`, body, { headers })
      .pipe(
        catchError(err => {
          // Propaga el mensaje de error
          return throwError(err.error.message || 'Error en el servidor');
        })
      );
  }

  register(nombre: string, apellido: string, email: string, password: string, obraSocialId: number): Observable<any> {
    const body = { nombre, apellido, email, password, obraSocialId };
    return this.http.post<any>(`${this.apiUrl}/register`, body) // Ajusta la URL según tu API
      .pipe(
        catchError(err => {
          // Propaga el mensaje de error
          return throwError(err.error.message || 'Error en el servidor');
        })
      );
  }
}
