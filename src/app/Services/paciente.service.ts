// paciente.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = `${environment.apiBaseUrl}/api/pacientes`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Método para obtener los datos de un paciente autenticado
  getPacienteData(): Observable<any> {
    const pacienteId = this.authService.getPacienteId(); // Obtiene el ID del paciente desde AuthService
    console.log('Paciente ID en Servicio:', pacienteId);  // Verifica el pacienteId aquí
    

    if (!pacienteId) {
      return throwError('Paciente no autenticado');
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(`${this.apiUrl}/${pacienteId}`, { headers })
      .pipe(
        catchError(err => {
          console.error('Error al obtener los datos del paciente:', err);
          return throwError(err.error.message || 'Error en el servidor');
        })
      );
  }


  actualizarPaciente(pacienteId: number, datos: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${pacienteId}`, datos);
  }

  // Método para eliminar paciente
  eliminarPaciente(pacienteId: number): Observable<void> {
    console.log(`Intentando eliminar paciente con ID: ${pacienteId}`);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    return this.http.delete<void>(`${this.apiUrl}/${pacienteId}`, { headers })
      .pipe(
        tap(() => {
          console.log(`Paciente con ID ${pacienteId} eliminado en la API`);
        }),
        catchError(err => {
          console.error('Error al eliminar el paciente en el servicio:', err);
          return throwError(err.error.message || 'Error en el servidor');
        })
      );
  }
}
