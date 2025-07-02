import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  proximosTurnos: Array<{ fecha: string; especialidad: string; medico: string }> = []; // Define la propiedad
  
  constructor(private router: Router) {}

  ngOnInit() {
    // Aquí puedes cargar los próximos turnos, por ejemplo, llamando a un servicio.
    this.proximosTurnos = [
      { fecha: '2024-11-10', especialidad: 'Cardiología', medico: 'Dr. González' },
      { fecha: '2024-11-12', especialidad: 'Dermatología', medico: 'Dra. Fernández' }
    ];
  }

  solicitarTurno() {
    this.router.navigate(['/turno-form']); // Redirige al formulario de turno
  }

  verTurnos() {
    this.router.navigate(['/listaTurnos']);  // Redirige a la página 'listaTurnos'
  }

  verPerfil() {
    this.router.navigate(['/perfil']);
  }

  goBack(): void {
  window.history.back();
}

}
