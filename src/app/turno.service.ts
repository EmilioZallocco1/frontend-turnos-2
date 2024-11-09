import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  private apiUrl = 'http://localhost:3000/api/turnos'; // Cambia esta URL si es necesario

  constructor(private http: HttpClient,private authService: AuthService) {}

  // Método para crear un turno
  crearTurno(turno: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}`, turno, { headers })
      .pipe(
        catchError(err => {
          console.error('Error en la creación del turno:', err);
          return throwError(err.error.message || 'Error en el servidor');
        })
      );
 }


// Método para obtener los turnos de un paciente según su ID
getTurnosPorPaciente(): Observable<any> {
  const pacienteId = this.authService.getPacienteId(); // Obtiene el ID del paciente desde AuthService
  console.log('Paciente ID:', pacienteId);  // Verifica el ID del paciente
  if (!pacienteId) {
    return throwError('Paciente no autenticado');
  }

  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.get<any>(`http://localhost:3000/api/pacientes/${pacienteId}/turnos`
, { headers })
    .pipe(
      catchError(err => {
        console.error('Error al obtener los turnos:', err);
        return throwError(err.error.message || 'Error en el servidor');
      })
    );
}

// // Método para actualizar un turno
// actualizarTurno(turnoId: number, turnoData: any): Observable<any> {
//   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
//   return this.http.put<any>(`${this.apiUrl}/${turnoId}`, turnoData, { headers })
//     .pipe(
//       catchError(err => {
//         console.error('Error al actualizar el turno:', err);
//         return throwError(err.error.message || 'Error en el servidor');
//       })
//     );
// }

// // Método para eliminar un turno
eliminarTurno(turnoId: number): Observable<any> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.delete<any>(`${this.apiUrl}/${turnoId}`, { headers })
    .pipe(
      catchError(err => {
        console.error('Error al eliminar el turno:', err);
        return throwError(() => err.error?.message || 'Error en el servidor');
      })
    );
}



         }


  // Puedes agregar otros métodos aquí para obtener, actualizar y eliminar turnos según sea necesa}
