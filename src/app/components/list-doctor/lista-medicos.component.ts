import { Component, OnInit, Renderer2 } from '@angular/core';
import { MedicoService } from '../../Services/doctor.service';

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

  // paginación
  page = 1;
  limit = 5;
  total = 0;
  totalPages = 0;
  cargando = false;

  constructor(private medicoService: MedicoService, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.listarMedicos();
  }


   listarMedicos(): void {
    this.cargando = true;
    this.mensajeError = null;

    this.medicoService.getAll(this.page, this.limit).subscribe({
      next: (res) => {
        this.medicos = res.data;
        this.page = res.page;
        this.limit = res.limit;
        this.total = res.total;
        this.totalPages = res.totalPages;
        this.cargando = false;
      },
      error: (err) => {
        this.mensajeError = 'Error al cargar los médicos';
        this.cargando = false;
        console.error(err);
      }
    });
  }

  paginaAnterior(): void {
    if (this.page > 1) {
      this.page--;
      this.listarMedicos();
    }
  }

  paginaSiguiente(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.listarMedicos();
    }
  }

  get filteredDoctors() {   // MEDICOS FILTRADOS
    return this.medicos.filter(m =>
      m.nombre.toLowerCase().includes(this.filtro.toLowerCase()) ||
      m.especialidad?.name?.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  


  deleteDoctor(id: number) {
  if (!confirm('¿Seguro que deseas eliminar este médico?')) return;

  this.medicoService.delete(id).subscribe({
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