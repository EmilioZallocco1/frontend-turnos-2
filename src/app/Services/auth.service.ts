import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/api`;
  private currentUser: any;

  constructor(private http: HttpClient) {
     // al crear el servicio, intentamos reconstruir el usuario 
    this.restoreUserFromJwt();
  }

  // Login para pacientes o admin
  login(email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/pacientes/login`;
    const body = { email, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

   return this.http.post<any>(url, body, { headers }).pipe(
      // lógica de guardar usuario en el servicio
      tap(user => {
        this.setCurrentUser(user);
        console.log('Usuario almacenado en localStorage:', user);
      }),
      //  uso moderno de throwError con función
      catchError(err => {
        return throwError(() => err?.error?.message || 'Error en el servidor');
      })
    );
  }

  // Registrar nuevo paciente
  register(nombre: string, apellido: string, email: string, password: string, obraSocialId: number): Observable<any> {
    const body = { nombre, apellido, email, password, obraSocialId: Number(obraSocialId) };
    return this.http.post<any>(`${this.apiUrl}/pacientes/register`, body).pipe(
      tap(user => this.setCurrentUser(user)),
      catchError(err => {
        return throwError(() => err?.error?.message || 'Error en el servidor');
      })
    );
  }

  // Guardar usuario actual
  private setCurrentUser(user: any) {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    //   (esto permite sacar localStorage del componente de login)
    if (user?.token) {
      localStorage.setItem('token', user.token);
    }
  }

    // si hay token en localStorage, recreamos el user en memoria
  private restoreUserFromJwt() {
    const storedUser = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');

    if (storedUser) {
      // ya tengo la info completa, solo la levanto
      this.currentUser = JSON.parse(storedUser);
      return;
    }

    if (token) {
      const decoded = this.getDecodedToken();
      if (decoded) {
        // armamos un "mini user" consistente con lo que usa el front
        this.currentUser = {
          message: 'Restaurado desde JWT',
          data: {
            id: decoded.id,
            role: decoded.role
          },
          token
        };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      }
    }
  }


  // NUEVO: helper para decodificar el JWT de forma segura
  private getDecodedToken(): any | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      // JWT = header.payload.signature -> queremos el payload (posición 1)
      const payload = token.split('.')[1];

      // Base64Url -> Base64
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');

      // atob decodifica base64 a string
      const jsonPayload = atob(base64);

      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error al decodificar el token JWT', e);
      return null;
    }
  }

  // Obtener ID del paciente logueado
  getPacienteId(): number | null {
    const decoded = this.getDecodedToken();
    return decoded?.id ?? null;
  }

  // Obtener el rol del usuario actual
  getRole(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.role ?? null;
  }

  //  Saber si el usuario es administrador
  esAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  esPaciente(): boolean {
    return this.getRole() === 'paciente';
  }

  // Saber si hay sesión iniciada
  isLoggedIn(): boolean {
    const decoded = this.getDecodedToken();
    if (!decoded) return false;
    // validar expiración si el token tiene "exp"
    if (decoded.exp) {
      const now = Math.floor(Date.now() / 1000); // segundos
      if (decoded.exp < now) {
        // Token vencido -> limpiar sesión
        this.logout();
        return false;
      }
    }

    return true;
  }

  // Cerrar sesión
  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token'); 
  }
}
