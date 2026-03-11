import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TurnoService {
  private apiUrl = `${environment.apiBaseUrl}/api/turnos`; 

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Método para crear un turno
  createTurno(turno: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}`, turno, { headers }).pipe(
      catchError((err) => {
        const msg =
          err?.status === 409
            ? err.error?.message || 'Conflicto: superposición de turnos.'
            : err.error?.message || 'Error en el servidor';
        return throwError(() => msg);
      })
    );
  }

  // Método para obtener los turnos de un paciente según su ID - TOKEN
// turno.service.ts

getTurnosPorPaciente(page: number = 1, limit: number = 5): Observable<any> {
  const token = localStorage.getItem('token');

  if (!token) {
    return throwError(() => 'Paciente no autenticado');
  }

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  return this.http
    .get<any>(
      `${environment.apiBaseUrl}/api/pacientes/me/turnos?page=${page}&limit=${limit}`,
      { headers }
    )
    .pipe(
      catchError((err) => {
        console.error('Error al obtener los turnos:', err);
        return throwError(() => err.error?.message || 'Error en el servidor');
      })
    );
}

  // // Método para actualizar un turno
  // Método para actualizar un turno
  updateTurno(turnoId: number, turnoData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Enviamos los datos bajo la clave "sanitizedInput" como espera el backend
    return this.http
      .put<any>(
        `${this.apiUrl}/${turnoId}`,
        { sanitizedInput: turnoData },
        { headers }
      )
      .pipe(
        catchError((err) => {
          console.error('Error al actualizar el turno:', err);
          return throwError(err.error.message || 'Error en el servidor');
        })
      );
  }

  // // Método para eliminar un turno
  deleteTurno(turnoId: number): Observable<void> {
    console.log(`Intentando eliminar turno con ID: ${turnoId}`);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .delete<void>(`${this.apiUrl}/${turnoId}`, { headers })
      .pipe(
        tap(() => {
          console.log(`Turno con ID ${turnoId} eliminado en la API`);
        }),
        catchError((err) => {
          console.error('Error al eliminar el turno en el servicio:', err);
          return throwError(err.error.message || 'Error en el servidor');
        })
      );
  }

  getTurnosPorMedico(medicoId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .get<any>(`${this.apiUrl}/medico/${medicoId}`, { headers })
      .pipe(
        catchError((err) => {
          console.error('Error al obtener los turnos del médico:', err);
          return throwError(err.error.message || 'Error en el servidor');
        })
      );
  }

  getTurnoById(id: number): Observable<any> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http
    .get<any>(`${this.apiUrl}/${id}`, { headers })
    .pipe(
      catchError((err) => {
        console.error('Error al obtener turno por ID:', err);
        return throwError(err.error?.message || 'Error en el servidor');
      })
    );
}


  getHorariosDisponibles(medicoId: number, fechaISO: string): Observable<any> {
    return this.http.get<any>(`${environment.apiBaseUrl}/api/turnos/disponibles`, {
      params: { medicoId, fecha: fechaISO },
    });
  }
}
