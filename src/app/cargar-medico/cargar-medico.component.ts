import { Component, OnInit } from '@angular/core';
import { MedicoService } from '../medico.service';
import { EspecialidadService } from '../especialidad.service';
import { ObraSocialService } from '../obra-social-service.service';

@Component({
  selector: 'app-cargar-medico',
  templateUrl: './cargar-medico.component.html',
  styleUrls: ['./cargar-medico.component.scss']
})
export class CargarMedicoComponent implements OnInit {
  medico = {
    nombre: '',
    email: '',
    telefono: '',
    especialidadId: null,
    obraSocialId: null
  };

  especialidades: any[] = [];
  obrasSociales: any[] = [];
  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  constructor(
    private medicoService: MedicoService,
    private especialidadService: EspecialidadService,
    private obraSocialService: ObraSocialService
  ) {}

  ngOnInit(): void {
    this.especialidadService.getEspecialidades().subscribe({
      next: res => this.especialidades = res.data,
      error: err => console.error('Error al cargar especialidades', err)
    });

    this.obraSocialService.getObrasSociales().subscribe({
      next: res => this.obrasSociales = res.data,
      error: err => console.error('Error al cargar obras sociales', err)
    });
  }

  registrarMedico(): void {
    const medicoData = {
      nombre: this.medico.nombre,
      email: this.medico.email,
      telefono: this.medico.telefono,
      especialidad: { id: this.medico.especialidadId },
      obraSocial: this.medico.obraSocialId ? { id: this.medico.obraSocialId } : null
    };

    this.medicoService.registrar(medicoData).subscribe({
      next: res => {
        this.mensajeExito = '✅ Médico registrado exitosamente.';
        this.mensajeError = null;
        this.medico = {
          nombre: '',
          email: '',
          telefono: '',
          especialidadId: null,
          obraSocialId: null
        };
      },
      error: err => {
        this.mensajeError = '❌ Error al registrar médico.';
        this.mensajeExito = null;
        console.error(err);
      }
    });
  }
}
