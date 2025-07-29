import { Component, OnInit } from '@angular/core';
import { MedicoService } from '../medico.service';

@Component({
  selector: 'app-lista-medicos',
  templateUrl: './lista-medicos.component.html',
  styleUrls: ['./lista-medicos.component.scss']
})
export class ListaMedicosComponent implements OnInit {
  medicos: any[] = [];
  mensajeError: string | null = null;

  constructor(private medicoService: MedicoService) {}

  ngOnInit(): void {
    this.medicoService.obtenerTodos().subscribe({
      next: (res) => {
        this.medicos = res.data;
      },
      error: (err) => {
        this.mensajeError = 'Error al obtener médicos';
        console.error(err);
      }
    });
  }
}
 