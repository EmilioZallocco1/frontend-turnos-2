import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { TurnoService } from '../../Services/shift.service';
import { MedicoService } from 'src/app/Services/doctor.service';

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
  }> = [];
  medicos: any[] = [];

  medicoId: number | null = null;
  fechaTurno: string = '';
  resultadoAdmin: any[] = [];

  constructor(
    private router: Router,
    public authService: AuthService,
    private turnoService: TurnoService,
    private medicoService: MedicoService
  ) {}

  ngOnInit() {
    if (this.authService.esPaciente()) {
      this.loadNextShifts();
      this.loadDoctors();
    }

    if (this.authService.esAdmin()) {
      this.loadDoctors();
    }
  }

  get doctorsOrderedBySpecialty() {
    return [...this.medicos].sort((a, b) => {
      const espA = (a.especialidad?.name || a.especialidad || '').toLowerCase();
      const espB = (b.especialidad?.name || b.especialidad || '').toLowerCase();

      if (espA < espB) return -1;
      if (espA > espB) return 1;

      const nomA = (a.nombre || '').toLowerCase();
      const nomB = (b.nombre || '').toLowerCase();

      return nomA.localeCompare(nomB);
    });
  }

  private loadNextShifts(): void {
    const pacienteId = this.authService.getPacienteId();

    if (!pacienteId) {
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
              fechaTurno >= new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

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
      },
      error: (err) => {
        console.error('Error cargando proximos turnos', err);
        this.proximosTurnos = [];
      },
    });
  }

  goToAdminPatientRegistration() {
    this.router.navigate(['/admin/alta-paciente']);
  }

  requestAppointment() {
    this.router.navigate(['/turno-form']);
  }

  viewAppointments() {
    this.router.navigate(['/listaTurnos']);
  }

  viewProfile() {
    this.router.navigate(['/perfil']);
  }

  goBack(): void {
    this.router.navigate(['/login']);
  }

  goToAddDoctor() {
    this.router.navigate(['/admin/medicos']);
  }

  goToAddInsurance() {
    this.router.navigate(['/admin/obras-sociales/nueva']);
  }

  viewDoctorsList() {
    this.router.navigate(['/lista-medicos']);
  }

  private loadDoctors(): void {
    this.medicoService.getAll().subscribe({
      next: (res) => {
        this.medicos = res.data;
      },
      error: (err) => {
        console.error('Error cargando medicos', err);
      },
    });
  }

  viewDoctorAppointments(): void {
    if (!this.medicoId) {
      alert('Debes ingresar un ID de medico');
      return;
    }

    this.turnoService.getTurnosPorMedico(this.medicoId).subscribe(
      (res) => {
        this.resultadoAdmin = res.data;
      },
      (error) => {
        console.error(error);
        this.resultadoAdmin = [];
        alert(error);
      }
    );
  }

  verPacientesPorFecha() {}

  changeStatus(turno: any, nuevoEstado: string) {
    const estadoAnterior = turno.estado;
    turno.estado = nuevoEstado;
    this.turnoService
      .updateTurno(turno.id, { estado: nuevoEstado })
      .subscribe({
        next: () => undefined,
        error: (err) => {
          console.error(err);
          turno.estado = estadoAnterior;
        },
      });
  }
}
