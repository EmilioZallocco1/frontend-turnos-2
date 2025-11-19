import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicoService } from 'src/app/Services/medico.service';
import { EspecialidadService } from 'src/app/Services/especialidad.service';
import { ObraSocialService } from 'src/app/Services/obra-social-service.service';

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

  idMedico: number | null = null;
  modoEdicion = false;

  constructor(
    private medicoService: MedicoService,
    private especialidadService: EspecialidadService,
    private obraSocialService: ObraSocialService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  

  ngOnInit(): void {
    this.idMedico = this.route.snapshot.params['id'];
    this.modoEdicion = !!this.idMedico;

    this.especialidadService.getEspecialidades().subscribe({
      next: res => this.especialidades = res.data,
      error: err => console.error('Error al cargar especialidades', err)
    });

    this.obraSocialService.getObrasSociales().subscribe({
      next: res => this.obrasSociales = res.data,
      error: err => console.error('Error al cargar obras sociales', err)
    });

    if (this.modoEdicion && this.idMedico) {
      this.medicoService.obtenerPorId(this.idMedico).subscribe({
        next: res => {
          const m = res.data;
          this.medico = {
            nombre: m.nombre,
            email: m.email,
            telefono: m.telefono,
            especialidadId: m.especialidad?.id ?? null,
            obraSocialId: m.obraSocial?.id ?? null
          };
        },
        error: err => {
          this.mensajeError = 'No se pudo cargar el médico.';
          console.error(err);
        }
      });
    }
  }

  guardarMedico(): void {
    const medicoData = {
      nombre: this.medico.nombre,
      email: this.medico.email,
      telefono: this.medico.telefono,
      especialidad: { id: this.medico.especialidadId },
      obraSocial: this.medico.obraSocialId ? { id: this.medico.obraSocialId } : null
    };

    if (this.modoEdicion && this.idMedico) {
      this.medicoService.actualizar(this.idMedico, medicoData).subscribe({
        next: res => {
          this.mensajeExito = '✅ Médico actualizado exitosamente.';
          this.mensajeError = null;
        },
        error: err => {
          this.mensajeError = '❌ Error al actualizar médico.';
          this.mensajeExito = null;
          console.error(err);
        }
      });
    } else {
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
          this.mensajeError = 'Error al registrar médico.';
          this.mensajeExito = null;
          console.error(err);
        }
      });
    }
  }
}
