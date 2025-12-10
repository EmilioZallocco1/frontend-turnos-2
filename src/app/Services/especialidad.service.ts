import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {
  private apiUrl = `${environment.apiBaseUrl}/api/especialidades`;

  constructor(private http: HttpClient) {}

  getEspecialidades(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      catchError(err => throwError(err.error.message || 'Error al obtener especialidades'))
    );
  }
}
