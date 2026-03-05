// paciente.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = `${environment.apiBaseUrl}/api/pacientes`;

  constructor(private http: HttpClient) {}

  // ✅ MI PERFIL (usa token)
  getPacienteData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`).pipe(
      catchError(err => {
        console.error('Error al obtener los datos del paciente:', err);
        return throwError(() => err.error?.message || 'Error en el servidor');
      })
    );
  }

  // ✅ ACTUALIZAR MI PERFIL (usa token)
  updatePaciente(datos: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/me`, datos).pipe(
      catchError(err => {
        console.error('Error al actualizar el paciente:', err);
        return throwError(() => err.error?.message || 'Error en el servidor');
      })
    );
  }

  // ✅ ELIMINAR MI CUENTA (usa token)
  deletePaciente(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/me`).pipe(
      tap(() => console.log(`Cuenta eliminada en la API`)),
      catchError(err => {
        console.error('Error al eliminar el paciente en el servicio:', err);
        return throwError(() => err.error?.message || 'Error en el servidor');
      })
    );
  }
}