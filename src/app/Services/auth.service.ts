import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Paciente } from '../models/patient.interface.js';
import { LoginResponse } from '../models/login-response.interface';

interface SessionResponse {
  data?: Paciente;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/api`;
  private currentUserSubject = new BehaviorSubject<Paciente | null>(null);

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  initializeSession(): Promise<void> {
    return new Promise((resolve) => {
      this.fetchCurrentUser().subscribe({
        next: () => resolve(),
        error: () => resolve(),
      });
    });
  }

  login(email: string, password: string): Observable<Paciente> {
    const url = `${this.apiUrl}/pacientes/login`;
    const body = { email, password };

    return this.http.post<LoginResponse>(url, body).pipe(
      switchMap((response) => {
        const responseUser = response?.data ?? null;
        if (responseUser) {
          this.setCurrentUser(responseUser);
          return of(responseUser);
        }

        return this.fetchCurrentUser().pipe(
          map((user) => {
            if (!user) {
              throw new Error('No se pudo recuperar la sesion del usuario.');
            }
            return user;
          })
        );
      }),
      catchError((err) =>
        throwError(() => err?.error?.message || err?.message || 'Error en el servidor')
      )
    );
  }

  register(
    nombre: string,
    apellido: string,
    email: string,
    password: string,
    obraSocialId: number
  ): Observable<any> {
    const body = { nombre, apellido, email, password, obraSocialId: Number(obraSocialId) };
    return this.http.post<any>(`${this.apiUrl}/pacientes/register`, body).pipe(
      catchError((err) =>
        throwError(() => err?.error?.message || 'Error en el servidor')
      )
    );
  }

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
    return this.http.post(url, body).pipe(
      catchError((err) =>
        throwError(() => err?.error?.message || 'Error en el servidor')
      )
    );
  }

  fetchCurrentUser(): Observable<Paciente | null> {
    return this.http.get<SessionResponse>(environment.authMeUrl).pipe(
      map((response) => response?.data ?? null),
      tap((user) => this.setCurrentUser(user)),
      catchError((err) => {
        this.setCurrentUser(null);
        if (err?.status === 401 || err?.status === 403) {
          return of(null);
        }
        return throwError(() => err);
      })
    );
  }

  getCurrentUser(): Paciente | null {
    return this.currentUserSubject.value;
  }

  getPacienteId(): number | null {
    return this.getCurrentUser()?.id ?? null;
  }

  getRole(): string | null {
    return this.getCurrentUser()?.role ?? null;
  }

  esAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  esPaciente(): boolean {
    return this.getRole() === 'paciente';
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  logout(): Observable<void> {
    return this.http.post<void>(environment.logoutUrl, {}).pipe(
      tap(() => this.setCurrentUser(null)),
      catchError((err) => {
        this.setCurrentUser(null);
        if (err?.status === 401 || err?.status === 403) {
          return of(void 0);
        }
        return throwError(() => err?.error?.message || 'Error al cerrar sesión');
      })
    );
  }

  clearSession(): void {
    this.setCurrentUser(null);
  }

  private setCurrentUser(user: Paciente | null): void {
    this.currentUserSubject.next(user);
  }
}
