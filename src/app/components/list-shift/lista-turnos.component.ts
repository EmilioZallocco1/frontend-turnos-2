import { Component, OnInit } from '@angular/core';
import { TurnoService } from '../../Services/shift.service';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-turnos',
  templateUrl: './lista-turnos.component.html',
  styleUrls: ['./lista-turnos.component.scss'],
})
export class ListaTurnosComponent implements OnInit {
  turnos: any[] = [];
  turnoEditando: any = null;
  error: string | null = null;
  successMessage: string | null = null;
  infoMessage = 'Cargando tus turnos...';
  eliminandoId: number | null = null;

  page = 1;
  limit = 5;
  total = 0;
  totalPages = 0;
  cargando = false;

  constructor(
    private turnoService: TurnoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getTurnos();
  }

  getTurnos() {
    this.cargando = true;
    this.error = null;
    this.infoMessage = 'Cargando tus turnos...';

    this.turnoService.getTurnosPorPaciente(this.page, this.limit).subscribe({
      next: (response: any) => {
        this.turnos = response.data;
        this.page = response.page;
        this.limit = response.limit;
        this.total = response.total;
        this.totalPages = response.totalPages;
        this.error = null;
        this.cargando = false;
        this.infoMessage = this.turnos.length
          ? 'Puedes editar o eliminar solo turnos con al menos 24 horas de anticipacion.'
          : 'Todavia no tienes turnos registrados.';
      },
      error: (err) => {
        this.error = err;
        this.cargando = false;
        this.infoMessage = 'No fue posible obtener los turnos.';
        console.error('Error al obtener los turnos:', err);
      },
    });
  }

  paginaAnterior() {
    if (this.page > 1) {
      this.page--;
      this.getTurnos();
    }
  }

  paginaSiguiente() {
    if (this.page < this.totalPages) {
      this.page++;
      this.getTurnos();
    }
  }

  deleteTurno(turnoId: number) {
    this.eliminandoId = turnoId;
    this.error = null;
    this.successMessage = null;
    this.infoMessage = 'Eliminando el turno seleccionado...';

    this.turnoService.deleteTurno(turnoId).subscribe({
      next: () => {
        this.eliminandoId = null;
        if (this.turnos.length === 1 && this.page > 1) {
          this.page--;
        }
        this.getTurnos();
        this.successMessage = `Turno ${turnoId} eliminado con exito.`;

        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        this.eliminandoId = null;
        this.error = 'Error al eliminar el turno.';
        this.infoMessage = 'Puedes volver a intentarlo desde el listado.';
        console.error(err);
      },
    });
  }

  puedeModificar(turno: any): boolean {
    if (!turno.fecha || !turno.hora) {
      return false;
    }

    const soloFecha = String(turno.fecha).split('T')[0];
    const [year, month, day] = soloFecha.split('-').map(Number);
    const [hour, minute] = String(turno.hora).split(':').map(Number);
    const fechaHoraTurno = new Date(year, month - 1, day, hour, minute, 0, 0);

    const ahora = new Date();
    const diffMs = fechaHoraTurno.getTime() - ahora.getTime();
    const diffHoras = diffMs / (1000 * 60 * 60);

    return diffHoras >= 24;
  }

  editarTurno(id: number) {
    this.router.navigate(['/turno-form', id]);
  }

  cancelarEdicion() {
    this.turnoEditando = null;
  }

  guardarEdicion() {
    if (!this.turnoEditando) {
      return;
    }

    this.turnoService
      .updateTurno(this.turnoEditando.id, {
        fecha: this.turnoEditando.fecha,
        hora: this.turnoEditando.hora,
        estado: this.turnoEditando.estado,
        descripcion: this.turnoEditando.descripcion,
        medico: this.turnoEditando.medico.id,
        paciente: this.turnoEditando.paciente.id,
      })
      .subscribe({
        next: () => {
          this.successMessage = 'Turno actualizado con exito.';
          this.error = null;
          this.turnoEditando = null;
          this.getTurnos();
        },
        error: (err) => {
          this.error = 'Error al actualizar el turno.';
          console.error('Error al actualizar el turno:', err);
        },
      });
  }

  goBack(): void {
    window.history.back();
  }
}
