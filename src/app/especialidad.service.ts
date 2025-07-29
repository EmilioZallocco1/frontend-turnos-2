import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {
  private apiUrl = 'http://localhost:3000/api/especialidades';

  constructor(private http: HttpClient) {}

  getEspecialidades(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      catchError(err => throwError(err.error.message || 'Error al obtener especialidades'))
    );
  }
}
