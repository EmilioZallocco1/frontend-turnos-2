import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MedicoService } from '../../Services/doctor.service';
import { EspecialidadService } from 'src/app/Services/specialty.service';
import { ObraSocialService } from 'src/app/Services/health-insurance.service';

@Component({
  selector: 'app-cargar-medico',
  templateUrl: './cargar-medico.component.html',
  styleUrls: ['./cargar-medico.component.scss'],
})
export class CargarMedicoComponent implements OnInit {
  medico = {
    nombre: '',
    email: '',
    telefono: '',
    especialidadId: null,
    obraSocialId: null,
  };
  especialidades: any[] = [];
  obrasSociales: any[] = [];
  mensajeExito: string | null = null;
  mensajeError: string | null = null;
  mensajeInfo = 'Completa los datos del profesional.';
  cargandoCatalogos = false;
  cargandoMedico = false;
  guardando = false;

  idMedico: number | null = null;
  modoEdicion = false;

  constructor(
    private medicoService: MedicoService,
    private especialidadService: EspecialidadService,
    private obraSocialService: ObraSocialService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.idMedico = this.route.snapshot.params['id'];
    this.modoEdicion = !!this.idMedico;
    this.cargarCatalogos();

    if (this.modoEdicion && this.idMedico) {
      this.cargarMedico(this.idMedico);
    }
  }

  private cargarCatalogos(): void {
    this.cargandoCatalogos = true;
    this.mensajeInfo = 'Cargando especialidades y obras sociales...';

    this.especialidadService.getEspecialidades().subscribe({
      next: (res) => (this.especialidades = res.data),
      error: (err) => {
        this.mensajeError = 'No se pudieron cargar las especialidades.';
        console.error('Error al cargar especialidades', err);
      },
    });

    this.obraSocialService.getObrasSociales().subscribe({
      next: (res) => {
        this.obrasSociales = res.data;
        this.cargandoCatalogos = false;
        this.mensajeInfo = this.modoEdicion
          ? 'Revisa la informacion del medico y guarda los cambios.'
          : 'Completa los datos para registrar un medico.';
      },
      error: (err) => {
        this.cargandoCatalogos = false;
        this.mensajeError = 'No se pudieron cargar las obras sociales.';
        this.mensajeInfo = 'El formulario puede quedar incompleto.';
        console.error('Error al cargar obras sociales', err);
      },
    });
  }

  private cargarMedico(id: number): void {
    this.cargandoMedico = true;
    this.mensajeInfo = 'Cargando datos del medico...';

    this.medicoService.getById(id).subscribe({
      next: (res) => {
        const m = res.data;
        this.medico = {
          nombre: m.nombre,
          email: m.email,
          telefono: m.telefono,
          especialidadId: m.especialidad?.id ?? null,
          obraSocialId: m.obraSocial?.id ?? null,
        };
        this.cargandoMedico = false;
        this.mensajeInfo = 'Puedes editar los campos y guardar los cambios.';
      },
      error: (err) => {
        this.cargandoMedico = false;
        this.mensajeError = 'No se pudo cargar el medico.';
        this.mensajeInfo = 'No pudimos preparar los datos para la edicion.';
        console.error(err);
      },
    });
  }

  guardarMedico(): void {
    this.guardando = true;
    this.mensajeExito = null;
    this.mensajeError = null;
    this.mensajeInfo = this.modoEdicion
      ? 'Guardando cambios del medico...'
      : 'Registrando medico...';

    const medicoData = {
      nombre: this.medico.nombre,
      email: this.medico.email,
      telefono: this.medico.telefono,
      especialidad: { id: this.medico.especialidadId },
      obraSocial: this.medico.obraSocialId
        ? { id: this.medico.obraSocialId }
        : null,
    };

    if (this.modoEdicion && this.idMedico) {
      this.medicoService.update(this.idMedico, medicoData).subscribe({
        next: () => {
          this.guardando = false;
          this.mensajeExito = 'Medico actualizado exitosamente.';
          this.mensajeInfo = 'Los cambios ya fueron guardados.';
        },
        error: (err) => {
          this.guardando = false;
          this.mensajeError = 'Error al actualizar medico.';
          this.mensajeInfo = 'No pudimos guardar los cambios.';
          console.error(err);
        },
      });
    } else {
      this.medicoService.register(medicoData).subscribe({
        next: () => {
          this.guardando = false;
          this.mensajeExito = 'Medico registrado exitosamente.';
          this.mensajeInfo = 'Puedes cargar otro profesional si lo necesitas.';
          this.medico = {
            nombre: '',
            email: '',
            telefono: '',
            especialidadId: null,
            obraSocialId: null,
          };
        },
        error: (err) => {
          this.guardando = false;
          this.mensajeError = 'Error al registrar medico.';
          this.mensajeInfo = 'No pudimos completar el alta.';
          console.error(err);
        },
      });
    }
  }

  goBack() {
    this.location.back();
  }
}
