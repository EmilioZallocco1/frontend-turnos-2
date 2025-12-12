import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
//import { Paciente } from '../models/paciente.interface';
import { Paciente } from '../models/patient.interface.js';
import { LoginResponse } from '../models/login-response.interface';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/api`;
  private currentUser: Paciente | null = null;

   private tokenKey = 'token';

  constructor(private http: HttpClient) {
    // al crear el servicio, intentamos reconstruir el usuario 
    this.restoreUserFromJwt();
  }

  // Login para pacientes o admin
  login(email: string, password: string): Observable<LoginResponse> {
    const url = `${this.apiUrl}/pacientes/login`;
    const body = { email, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

   return this.http.post<any>(url, body, { headers }).pipe(
      // lógica de guardar usuario en el servicio
      tap(res => {
        //this.setCurrentUser(user);
        //console.log('Usuario almacenado en localStorage:', user);
        const token = res?.token ?? res?.data?.token;
        if (!token) {
          console.error('❌ No se recibió token en la respuesta:', res);
          throw new Error('No se recibió token de autenticación');
        }
        localStorage.setItem(this.tokenKey, token);
        this.restoreUserFromJwt();
        console.log('✅ TOKEN guardado:', token);
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
      tap((res: any) => {
        // si tu API de register devuelve token, lo guardás igual que en login
        const token = res?.token ?? res?.data?.token;
        if (token) {
          localStorage.setItem(this.tokenKey, token);
          this.restoreUserFromJwt();
          console.log('TOKEN guardado (register):', token);
        }
      }),
      catchError(err =>
        throwError(() => err?.error?.message || 'Error en el servidor')
      )
    );
  }

    // registro hecho por un ADMIN
  registerByAdmin(
    nombre: string,
    apellido: string,
    email: string,
    password: string,
    obraSocialId: number,
    role: 'admin' | 'paciente' = 'admin'
  ): Observable<any> {
    const url = `${this.apiUrl}/pacientes/admin/create`; 
    const body = { nombre, apellido, email, password, obraSocialId, role };
    return this.http.post(url, body);
  }
  

    // si hay token en localStorage, recreamos el user en memoria
  private restoreUserFromJwt() {
    //const storedUser = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');

     if (!token) {
    this.currentUser = null;
    // limpiar restos viejos de versiones anteriores
    localStorage.removeItem('currentUser');
    return;
  }

     const decoded = this.getDecodedToken();
  if (!decoded) {
    this.currentUser = null;
    return;
  }
  // recreamos el usuario SOLO en memoria
  this.currentUser = {
    id: decoded.id,
    role: decoded.role,
    email: decoded.email,
    nombre: decoded.nombre,
    apellido: decoded.apellido
  };
   
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
