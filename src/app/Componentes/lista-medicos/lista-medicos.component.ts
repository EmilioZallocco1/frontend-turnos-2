import { Component, OnInit, Renderer2 } from '@angular/core';
import { MedicoService } from '../../Services/medico.service';

@Component({
  selector: 'app-lista-medicos',
  templateUrl: './lista-medicos.component.html',
  styleUrls: ['./lista-medicos.component.scss']
})
export class ListaMedicosComponent implements OnInit {
  medicos: any[] = [];
  mensajeError: string | null = null;
  filtro = '';
  modoOscuro = false;

  constructor(private medicoService: MedicoService, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.medicoService.obtenerTodos().subscribe({
      next: res => {
        this.medicos = res.data;
      },
      error: err => {
        this.mensajeError = 'Error al cargar los médicos';
        console.error(err);
      }
    });
  }

  get medicosFiltrados() {
    return this.medicos.filter(m =>
      m.nombre.toLowerCase().includes(this.filtro.toLowerCase()) ||
      m.especialidad?.name?.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }


  eliminarMedico(id: number) {
  if (!confirm('¿Seguro que deseas eliminar este médico?')) return;

  this.medicoService.eliminar(id).subscribe({
    next: () => {
      this.medicos = this.medicos.filter(m => m.id !== id);
      this.mensajeError = '';
    },
    error: (e) => {
      if (e?.status === 409 && e?.error?.message) {
        this.mensajeError = e.error.message; // “tiene turnos asociados”
      } else if (e?.status === 404) {
        this.mensajeError = 'El médico no existe (ya fue eliminado).';
        this.medicos = this.medicos.filter(m => m.id !== id);
      } else {
        this.mensajeError = 'No se pudo eliminar el médico.';
      }
    },
  });
}


  goBack(): void {
    window.history.back();
  }

  toggleModoOscuro(): void {
    this.modoOscuro = !this.modoOscuro;
    const body = document.body;
    if (this.modoOscuro) {
      this.renderer.addClass(body, 'modo-oscuro');
    } else {
      this.renderer.removeClass(body, 'modo-oscuro');
    }
  }
}