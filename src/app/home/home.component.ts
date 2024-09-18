import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  proximosTurnos = [
    { fecha: '2024-09-20', especialidad: 'Cardiología', medico: 'Juan Pérez' },
    { fecha: '2024-09-22', especialidad: 'Dermatología', medico: 'Ana García' },
    { fecha: '2024-09-25', especialidad: 'Pediatría', medico: 'María López' }
  ];

  constructor(private router: Router) { }

  // Navegar a otras páginas
  solicitarTurno() {
    this.router.navigate(['/solicitar-turno']);
  }

  verTurnos() {
    this.router.navigate(['/mis-turnos']);
  }

  verPerfil() {
    this.router.navigate(['/perfil']);
  }
}
