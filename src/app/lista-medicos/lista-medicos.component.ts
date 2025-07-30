import { Component, OnInit, Renderer2 } from '@angular/core';
import { MedicoService } from '../medico.service';

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
