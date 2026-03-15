import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TurnoService } from '../../Services/shift.service';
import { AuthService } from '../../Services/auth.service';
import { ObraSocialService } from 'src/app/Services/health-insurance.service';

@Component({
  selector: 'app-turno-form',
  templateUrl: './turno-form.component.html',
  styleUrls: ['./turno-form.component.scss'],
})
export class TurnoFormComponent implements OnInit {
  turnoForm: FormGroup;
  medicos: any[] = [];
  horariosDisponibles: string[] = [];
  turnoOriginal: any | null = null;
  hoy = '';

  errorMsg = '';
  successMsg = '';
  infoMsg = 'Selecciona medico y fecha para ver horarios disponibles.';
  redirectCountdown = 0;

  cargandoMedicos = false;
  cargandoTurno = false;
  cargandoHorarios = false;
  guardandoTurno = false;

  modoEdicion = false;
  turnoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private turnoService: TurnoService,
    private authService: AuthService,
    private obraSocialService: ObraSocialService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.turnoForm = this.fb.group({
      fecha: ['', [Validators.required]],
      hora: [{ value: '', disabled: true }, [Validators.required]],
      descripcion: ['', [Validators.required]],
      medicoId: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    this.hoy = `${yyyy}-${mm}-${dd}`;

    this.loadMedicos();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.modoEdicion = true;
        this.turnoId = +id;
        this.cargarTurnoParaEditar(this.turnoId);
      }
    });

    this.turnoForm.get('fecha')?.valueChanges.subscribe(() => {
      this.cargarHorariosDisponibles();
    });
    this.turnoForm.get('medicoId')?.valueChanges.subscribe(() => {
      this.cargarHorariosDisponibles();
    });
  }

  loadMedicos() {
    this.cargandoMedicos = true;
    this.infoMsg = 'Cargando medicos disponibles...';

    this.obraSocialService.getMedicos().subscribe({
      next: (response) => {
        this.medicos = response.data;
        this.cargandoMedicos = false;
        this.infoMsg = this.medicos.length
          ? 'Selecciona medico y fecha para consultar horarios.'
          : 'No hay medicos disponibles para reservar.';
      },
      error: () => {
        this.errorMsg = 'No se pudieron cargar los medicos.';
        this.cargandoMedicos = false;
        this.infoMsg = 'Intenta nuevamente mas tarde.';
      },
    });
  }

  cargarTurnoParaEditar(id: number) {
    this.cargandoTurno = true;
    this.infoMsg = 'Cargando los datos del turno...';

    this.turnoService.getTurnoById(id).subscribe({
      next: (res) => {
        const t = res.data;
        this.turnoOriginal = t;
        const soloFecha = t.fecha ? String(t.fecha).split('T')[0] : '';

        this.turnoForm.patchValue({
          fecha: soloFecha,
          hora: t.hora,
          descripcion: t.descripcion,
          medicoId: t.medico?.id ?? t.medicoId,
        });

        this.turnoForm.get('medicoId')?.disable({ emitEvent: false });
        this.cargarHorariosDisponibles();
        this.cargandoTurno = false;
        this.infoMsg =
          'Puedes modificar fecha, hora y descripcion. El medico asignado no se puede cambiar.';
      },
      error: (err) => {
        console.error('Error al cargar turno para edicion:', err);
        this.errorMsg = 'No se pudo cargar el turno para editar.';
        this.cargandoTurno = false;
        this.infoMsg = 'No pudimos preparar el formulario.';
      },
    });
  }

  cargarHorariosDisponibles() {
    const fecha = this.turnoForm.get('fecha')?.value;
    const medicoId = this.turnoForm.get('medicoId')?.value;

    if (!fecha || !medicoId) {
      this.horariosDisponibles = [];
      this.infoMsg = 'Selecciona medico y fecha para ver horarios disponibles.';
      this.actualizarEstadoHora();
      return;
    }

    this.cargandoHorarios = true;
    this.infoMsg = 'Buscando horarios disponibles...';

    this.turnoService.getHorariosDisponibles(medicoId, fecha).subscribe({
      next: (res) => {
        let lista = res.data || res;
        if (!Array.isArray(lista)) {
          lista = [];
        }

        const horaActual = this.turnoForm.get('hora')?.value;
        if (horaActual && !lista.includes(horaActual)) {
          lista.unshift(horaActual);
        }

        this.horariosDisponibles = lista;

        if (!horaActual) {
          this.turnoForm.get('hora')?.reset('');
        }

        this.cargandoHorarios = false;
        this.infoMsg = this.horariosDisponibles.length
          ? 'Selecciona uno de los horarios disponibles.'
          : 'No hay horarios disponibles para esa fecha.';
        this.actualizarEstadoHora();
      },
      error: () => {
        this.cargandoHorarios = false;
        this.horariosDisponibles = [];
        this.turnoForm.get('hora')?.reset('');
        this.infoMsg = 'No pudimos consultar los horarios del medico.';
        this.actualizarEstadoHora();
      },
    });
  }

  volverHome() {
    this.router.navigate(['/home']);
  }

  onSubmit() {
    if (this.turnoForm.invalid) {
      this.turnoForm.markAllAsTouched();
      this.errorMsg = 'Completa todos los campos requeridos.';
      this.infoMsg = 'Faltan datos antes de guardar el turno.';
      return;
    }

    this.errorMsg = '';
    this.successMsg = '';
    this.guardandoTurno = true;
    this.infoMsg = this.modoEdicion
      ? 'Guardando cambios del turno...'
      : 'Registrando el turno...';

    if (this.modoEdicion && this.turnoId !== null) {
      this.actualizarTurno();
    } else {
      this.crearTurno();
    }
  }

  private crearTurno() {
    const { fecha, hora, descripcion, medicoId } = this.turnoForm.getRawValue();
    const pacienteId = this.authService.getPacienteId();

    if (!pacienteId) {
      this.guardandoTurno = false;
      this.errorMsg = 'No se pudo identificar al paciente.';
      return;
    }

    const nuevoTurno = {
      fecha,
      hora,
      descripcion,
      estado: 'Pendiente',
      medicoId: Number(medicoId),
      pacienteId: Number(pacienteId),
      duracionMin: 30,
    };

    this.turnoService.createTurno(nuevoTurno).subscribe({
      next: () => {
        this.guardandoTurno = false;
        this.successMsg =
          'Turno creado con exito. Seras redirigido al inicio en 5 segundos.';
        this.infoMsg = 'Ya reservamos el turno.';
        this.turnoForm.reset();
        this.actualizarEstadoHora();
        this.iniciarRedireccion();
      },
      error: (msg: string) => {
        this.guardandoTurno = false;
        this.errorMsg = msg || 'Error al crear el turno.';
        this.infoMsg = 'No pudimos guardar el turno.';
        console.error('Error al crear el turno:', msg);
      },
    });
  }

  private actualizarTurno() {
    const { fecha, hora, descripcion } = this.turnoForm.getRawValue();

    const turnoActualizado = {
      fecha,
      hora,
      descripcion,
    };

    this.turnoService.updateTurno(this.turnoId!, turnoActualizado).subscribe({
      next: () => {
        this.guardandoTurno = false;
        this.successMsg =
          'Turno actualizado con exito. Seras redirigido al inicio en 5 segundos.';
        this.infoMsg = 'Los cambios ya fueron guardados.';
        this.iniciarRedireccion();
      },
      error: (err: any) => {
        this.guardandoTurno = false;
        const msg =
          typeof err === 'string'
            ? err
            : err?.message || 'Error al actualizar el turno.';
        this.errorMsg = msg;
        this.infoMsg = 'No pudimos guardar los cambios.';
        console.error('Error al actualizar el turno:', err);
      },
    });
  }

  private actualizarEstadoHora() {
    const horaCtrl = this.turnoForm.get('hora');

    if (!this.horariosDisponibles.length) {
      horaCtrl?.reset('');
      horaCtrl?.disable({ emitEvent: false });
    } else {
      horaCtrl?.enable({ emitEvent: false });
    }
  }

  private iniciarRedireccion() {
    this.redirectCountdown = 5;
    const interval = setInterval(() => {
      this.redirectCountdown--;
      if (this.redirectCountdown === 0) {
        clearInterval(interval);
        this.router.navigate(['/home']);
      }
    }, 1000);
  }
}
