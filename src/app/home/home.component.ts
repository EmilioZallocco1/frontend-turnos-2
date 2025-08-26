import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { TurnoService } from '../turno.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  proximosTurnos: Array<{ fecha: string; especialidad: string; medico: string }> = []; // Define la propiedad
  
  constructor(private router: Router,public authService: AuthService, private turnoService: TurnoService) {}


  medicoId: number | null = null;
  fechaTurno: string = '';
  resultadoAdmin: any[] = [];

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

    irACargarMedico() {
    this.router.navigate(['/admin/medicos']);
  }

  irACargarObraSocial() {
    this.router.navigate(['/admin/obras-sociales/nueva']);
  }

  verListaMedicos() {
  this.router.navigate(['/lista-medicos']);
}



//-------------------------------------------------------- PRUEBAS --------------------------------------------------------

   verTurnosMedico(): void {
    if (!this.medicoId) {
      alert('Debes ingresar un ID de médico');
      return;
    }

    this.turnoService.getTurnosPorMedico(this.medicoId).subscribe(
      (res) => {
        console.log('Turnos del médico:', res);
        this.resultadoAdmin = res.data; // Asigna los turnos a la lista
      },
      (error) => {
        console.error(error);
        this.resultadoAdmin = []; // Limpia en caso de error
        alert(error);
      }
    );
  }

  verPacientesPorFecha() {}


}
