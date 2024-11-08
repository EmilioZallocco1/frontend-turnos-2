// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private apiUrl = 'http://localhost:3000/api'; // URL base de tu API

//   constructor(private http: HttpClient) {}

//   // Método de login para pacientes
//   login(email: string, password: string): Observable<any> {
//     const url = `${this.apiUrl}/pacientes/login`; // URL para el login de pacientes
//     const body = { email, password };
//     const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
//     return this.http.post<any>(url, body, { headers })
//       .pipe(
//         catchError(err => {
//           return throwError(err.error.message || 'Error en el servidor');
//         })
//       );
//   }



  

//   // Método de registro para pacientes
//   register(nombre: string, apellido: string, email: string, password: string, obraSocialId: number): Observable<any> {
//     const body = { nombre, apellido, email, password, obraSocialId };
//     return this.http.post<any>(`${this.apiUrl}/pacientes/register`, body) // Cambia la ruta si es necesario
//       .pipe(
//         catchError(err => {
//           return throwError(err.error.message || 'Error en el servidor');
//         })
//       );
//   }
// }



import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; // URL base de tu API
  private currentUser: any; // Para almacenar la información del usuario autenticado

  constructor(private http: HttpClient) {}

  // Método de login para pacientes
  login(email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/pacientes/login`;
    const body = { email, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    return this.http.post<any>(url, body, { headers })
      .pipe(
        tap(user => {
          this.setCurrentUser(user);
          console.log('Usuario almacenado en localStorage:', user); // Verificar qué datos se están almacenando
        }),
        catchError(err => {
          return throwError(err.error.message || 'Error en el servidor');
        })
      );
  }
  

  // Método para almacenar el usuario autenticado
  private setCurrentUser(user: any) {
    this.currentUser = user; // Guarda el usuario en una variable local
    localStorage.setItem('currentUser', JSON.stringify(user)); // Guarda el usuario en localStorage
  }

  // Método para obtener el ID del paciente actual
  getPacienteId(): number | null {
    if (this.currentUser) {
      return this.currentUser.data.id; // Accede al ID del paciente desde la propiedad 'data'
    }
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUser = JSON.parse(user);
      return this.currentUser.data.id; // Accede al ID del paciente desde la propiedad 'data'
    }
    return null; // Si no hay usuario autenticado
  }
  
  

  // Método de registro para pacientes
  register(nombre: string, apellido: string, email: string, password: string, obraSocialId: number): Observable<any> {
    const body = { nombre, apellido, email, password, obraSocialId };
    return this.http.post<any>(`${this.apiUrl}/pacientes/register`, body) // Cambia la ruta si es necesario
      .pipe(
        tap(user => this.setCurrentUser(user)), // Almacena el usuario después del registro
        catchError(err => {
          return throwError(err.error.message || 'Error en el servidor');
        })
      );
  }
}

