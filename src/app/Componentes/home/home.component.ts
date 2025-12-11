import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { TurnoService } from '../../Services/turno.service';
import { MedicoService } from 'src/app/Services/medico.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  proximosTurnos: Array<{
    fecha: string;
    especialidad: string;
    medico: string;
  }> = []; // Define la propiedad
  medicos: any[] = [];
  constructor(
    private router: Router,
    public authService: AuthService,
    private turnoService: TurnoService,
    private medicoService: MedicoService
  ) {}

  medicoId: number | null = null;
  fechaTurno: string = '';
  resultadoAdmin: any[] = [];

  ngOnInit() {

    console.log('DEBUG ROL (JWT):', this.authService.getRole());
    console.log('DEBUG ID (JWT):', this.authService.getPacienteId());
    console.log('DEBUG LOGGED IN (JWT):', this.authService.isLoggedIn());
    console.log("DEBUG currentUser en memoria:", this.authService["currentUser"]);

    // Aquí puedes cargar los próximos turnos, por ejemplo, llamando a un servicio.

    if (this.authService.esPaciente()) {
      this.cargarProximosTurnos();
    }

    if (this.authService.esAdmin()) {
      this.cargarMedicos();
    }
  }

  private cargarProximosTurnos(): void {
    const pacienteId = this.authService.getPacienteId();

    // Por las dudas, si no hay paciente logueado, no llamamos a la API
    if (!pacienteId) {
      console.warn('No se encontró paciente logueado');
      this.proximosTurnos = [];
      return;
    }

    this.turnoService.getTurnosPorPaciente().subscribe({
      next: (res) => {
        const turnos = res.data || res;

        const hoy = new Date();
        this.proximosTurnos = (turnos || [])
          .filter((t: any) => {
            const fechaTurno = new Date(t.fecha);
            const esFuturo =
              fechaTurno >=
              new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
            // dejamos sólo pendientes
            return t.estado
              ? t.estado.toLowerCase() === 'pendiente' && esFuturo
              : esFuturo;
          })
          .map((t: any) => ({
            fecha: t.fecha,
            especialidad:
              t.medico?.especialidad || t.especialidad || 'Sin especialidad',
            medico: t.medico?.nombre || t.medico || 'Profesional',
          }));

        console.log('Próximos turnos en home:', this.proximosTurnos);
      },
      error: (err) => {
        console.error('Error cargando próximos turnos', err);
        this.proximosTurnos = [];
      },
    });
  }

  solicitarTurno() {
    this.router.navigate(['/turno-form']); // Redirige al formulario de turno
  }

  verTurnos() {
    this.router.navigate(['/listaTurnos']); // Redirige a la página 'listaTurnos'
  }

  verPerfil() {
    this.router.navigate(['/perfil']);
  }

  goBack(): void {
    this.router.navigate(['/login']);
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

  private cargarMedicos(): void {
    this.medicoService.obtenerTodos().subscribe({
      next: (res) => {
        // tu backend devuelve { message: 'ok', data: [...] }
        this.medicos = res.data;
        console.log('Médicos cargados:', this.medicos);
      },
      error: (err) => {
        console.error('Error cargando médicos', err);
      },
    });
  }
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

  cambiarEstado(turno: any, nuevoEstado: string) {
    const estadoAnterior = turno.estado;
    turno.estado = nuevoEstado;
    this.turnoService
      .actualizarTurno(turno.id, { estado: nuevoEstado })
      .subscribe({
        next: () => console.log('Estado actualizado correctamente'),
        error: (err) => {
          console.error(err);
          turno.estado = estadoAnterior; // revertir si falla
        },
      });
  }
}
