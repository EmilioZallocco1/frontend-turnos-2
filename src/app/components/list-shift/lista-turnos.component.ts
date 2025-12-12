import { Component, OnInit } from '@angular/core';
import { TurnoService } from '../../Services/shift.service';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-turnos',
  templateUrl: './lista-turnos.component.html',
  styleUrls: ['./lista-turnos.component.scss']
})
export class ListaTurnosComponent implements OnInit {
  turnos: any[] = [];
  turnoEditando: any = null;  // 🆕 Turno en modo edición
  error: string | null = null;
  successMessage: string | null = null;

  constructor(
    private turnoService: TurnoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.obtenerTurnos();
  }

  obtenerTurnos() {
    this.turnoService.getTurnosPorPaciente().subscribe({
      next: (response: any) => {
        this.turnos = response.data;
        this.error = null;
      },
      error: err => {
        this.error = err;
        console.error('Error al obtener los turnos:', err);
      }
    });
  }

  eliminarTurno(turnoId: number) {
    console.log(`Intentando eliminar turno con ID: ${turnoId}`);
    this.turnoService.eliminarTurno(turnoId).subscribe({
      next: () => {
        this.turnos = this.turnos.filter(turno => turno.id !== turnoId);
        this.successMessage = `Turno con ID ${turnoId} eliminado con éxito`;
        console.log(`Turno con ID ${turnoId} eliminado`);

        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: err => {
        this.error = 'Error al eliminar el turno';
        console.error('Error al eliminar el turno en el componente:', err);
      }
    });
  }

puedeModificar(turno: any): boolean {
  if (!turno.fecha || !turno.hora) return false;

  // turno.fecha puede venir como "2025-12-13T00:00:00.000Z"
  const soloFecha = String(turno.fecha).split('T')[0]; // "2025-12-13"

  const [year, month, day] = soloFecha.split('-').map(Number);
  const [hour, minute] = String(turno.hora).split(':').map(Number);

  // Fecha y hora del turno (en horario local)
  const fechaHoraTurno = new Date(year, month - 1, day, hour, minute, 0, 0);

  const ahora = new Date();
  const diffMs = fechaHoraTurno.getTime() - ahora.getTime();
  const diffHoras = diffMs / (1000 * 60 * 60);

  // Solo se puede modificar/eliminar si faltan 24 hs o más
  return diffHoras >= 24;
}



  // 🆕 Inicia la edición de un turno
  editarTurno(id: number) {
  this.router.navigate(['/turno-form', id]);
}

  // 🆕 Cancela la edición
  cancelarEdicion() {
    this.turnoEditando = null;
  }

  // 🆕 Guarda los cambios
  guardarEdicion() {
    if (!this.turnoEditando) return;

    this.turnoService.actualizarTurno(this.turnoEditando.id, {
      fecha: this.turnoEditando.fecha,
      hora: this.turnoEditando.hora,
      estado: this.turnoEditando.estado,
      descripcion: this.turnoEditando.descripcion,
      medico: this.turnoEditando.medico.id,
      paciente: this.turnoEditando.paciente.id
    }).subscribe({
      next: res => {
        this.successMessage = 'Turno actualizado con éxito';
        this.error = null;
        this.turnoEditando = null;
        this.obtenerTurnos(); // Refresca lista actualizada
      },
      error: err => {
        this.error = 'Error al actualizar el turno';
        console.error('Error al actualizar el turno:', err);
      }
    });
  }

  goBack(): void {
    window.history.back();
  }
}
