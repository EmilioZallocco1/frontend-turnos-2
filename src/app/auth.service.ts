import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; // URL base de tu API

  constructor(private http: HttpClient) { }

  // Método de login adaptable a rol
  login(email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/pacientes/login`; // Asegúrate de que el rol no se esté pasando como parte de la URL
    const body = { email, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(url, body, { headers })
      .pipe(
        catchError(err => {
          return throwError(err.error.message || 'Error en el servidor');
        })
      );
  }
  
  

  // Método de registro adaptable a rol
  register(nombre: string, apellido: string, email: string, password: string, obraSocialId: number, role: string): Observable<any> {
    const body = { nombre, apellido, email, password, obraSocialId, role };
    return this.http.post<any>(`${this.apiUrl}/register`, body)
      .pipe(
        catchError(err => {
          return throwError(err.error.message || 'Error en el servidor');
        })
      );
  }
  
}
