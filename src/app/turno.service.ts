import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  private apiUrl = 'http://localhost:3000/api/turnos'; // Cambia esta URL si es necesario

  constructor(private http: HttpClient) {}

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

  // Puedes agregar otros métodos aquí para obtener, actualizar y eliminar turnos según sea necesario
}
