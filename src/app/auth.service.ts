import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private currentUser: any;

  constructor(private http: HttpClient) {}

  // Login para pacientes o admin
  login(email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/pacientes/login`;
    const body = { email, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(url, body, { headers }).pipe(
      tap(user => {
        this.setCurrentUser(user);
        console.log('Usuario almacenado en localStorage:', user);
      }),
      catchError(err => {
        return throwError(err.error.message || 'Error en el servidor');
      })
    );
  }

  // Registrar nuevo paciente
  register(nombre: string, apellido: string, email: string, password: string, obraSocialId: number): Observable<any> {
    const body = { nombre, apellido, email, password, obraSocialId };
    return this.http.post<any>(`${this.apiUrl}/pacientes/register`, body).pipe(
      tap(user => this.setCurrentUser(user)),
      catchError(err => {
        return throwError(err.error.message || 'Error en el servidor');
      })
    );
  }

  // Guardar usuario actual
  private setCurrentUser(user: any) {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  // Obtener ID del paciente logueado
  getPacienteId(): number | null {
    if (this.currentUser) {
      return this.currentUser.data.id;
    }
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUser = JSON.parse(user);
      return this.currentUser.data.id;
    }
    return null;
  }

  // Obtener el rol del usuario actual
  getRole(): string | null {
    if (this.currentUser) {
      return this.currentUser.data.role;
    }
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUser = JSON.parse(user);
      return this.currentUser.data.role;
    }
    return null;
  }

  //  Saber si el usuario es administrador
  esAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  // Saber si hay sesión iniciada
  isLoggedIn(): boolean {
    return !!this.getPacienteId(); // Devuelve true si hay ID
  }

  // Cerrar sesión
  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }
}
