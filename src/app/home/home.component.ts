import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatePipe, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es'; // Importa el locale en español

// Registra el locale de español
registerLocaleData(localeEs, 'es');

interface Medico {
  nombre: string;  // Define el nombre del médico como propiedad
  especialidad: string;  // Define el nombre del médico como propiedad
}

interface Turno {
  fecha: string;
  medico: Medico;  // Cambié a un objeto Medico
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [DatePipe, { provide: LOCALE_ID, useValue: 'es' }]  // Proveedor de DatePipe y configuración del idioma
})
export class HomeComponent implements OnInit {
  proximosTurnos: Turno[] = [];

  constructor(
    private router: Router, 
    private http: HttpClient,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.cargarTurnos();
  }

  cargarTurnos() {
    this.obtenerTurnosActuales().subscribe(
      (turnosResponse) => {
        console.log(turnosResponse);
        // Mapeamos la respuesta para ajustar la estructura de cada turno
        this.proximosTurnos = turnosResponse.data.map((turno: any) => ({
          fecha: turno.fecha,
          especialidad: turno.especialidad,
          medico: turno.medico  // Ahora 'medico' es un objeto con la propiedad 'nombre'
        }));
      },
      (error) => {
        console.error('Error al cargar los turnos:', error);
      }
    );
  }

  obtenerTurnosActuales(): Observable<{ data: Turno[] }> {
    const apiUrl = 'http://localhost:3000/api/turnos'; // Reemplaza con tu URL real
    return this.http.get<{ data: Turno[] }>(apiUrl);
  }

  solicitarTurno() {
    this.router.navigate(['/turno-form']); // Redirige al formulario de turno
  }

  verTurnos() {
    // Implementa la lógica para ver los turnos
  }

  verPerfil() {
    // Implementa la lógica para ver el perfil
  }
}
