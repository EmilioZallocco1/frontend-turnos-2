import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TurnoService } from '../turno.service';
import { AuthService } from '../auth.service';
import { ObraSocialService } from '../obra-social-service.service';

@Component({
  selector: 'app-turno-form',
  templateUrl: './turno-form.component.html',
  styleUrls: ['./turno-form.component.scss']
})
export class TurnoFormComponent implements OnInit {
  turnoForm: FormGroup;
  medicos: any[] = [];
  horariosDisponibles: string[] = [];

  errorMsg = '';
  successMsg = '';
  redirectCountdown = 0; // segundos restantes antes de redirigir

  //  para saber si estoy creando o editando
  modoEdicion = false;
  turnoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private turnoService: TurnoService,
    private authService: AuthService,
    private obraSocialService: ObraSocialService,
    private router: Router,
    private route: ActivatedRoute   // 
  ) {
    this.turnoForm = this.fb.group({
      fecha: ['', [Validators.required]],
      hora: [{ value: '', disabled: true }, [Validators.required]],
      descripcion: ['', [Validators.required]],
      medicoId: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadMedicos();

    // 👇 si viene /turno-form/:id => modo edición
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.modoEdicion = true;
        this.turnoId = +id;
        this.cargarTurnoParaEditar(this.turnoId);
      }
    });

    // recargar horarios al cambiar fecha o médico
    this.turnoForm.get('fecha')?.valueChanges.subscribe(() => {
      this.cargarHorariosDisponibles();
    });
    this.turnoForm.get('medicoId')?.valueChanges.subscribe(() => {
      this.cargarHorariosDisponibles();
    });
  }

  loadMedicos() {
    this.obraSocialService.getMedicos().subscribe({
      next: (response) => (this.medicos = response.data),
      error: (error) => console.error('Error al cargar médicos:', error)
    });
  }

  // 👇 carga el turno desde la API y llena el formulario
  cargarTurnoParaEditar(id: number) {
    this.turnoService.getTurnoById(id).subscribe({
      next: (res) => {
        const t = res.data;

        // fecha ISO -> 'YYYY-MM-DD' para el input date
        const d = new Date(t.fecha);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');

        this.turnoForm.patchValue({
          fecha: `${yyyy}-${mm}-${dd}`,
          hora: t.hora,
          descripcion: t.descripcion,
          medicoId: t.medico?.id ?? t.medicoId
        });

        // cargar horarios para esa fecha/médico (manteniendo la hora actual si hace falta)
        this.cargarHorariosDisponibles();
      },
      error: (err) => {
        console.error('Error al cargar turno para edición:', err);
        this.errorMsg = 'No se pudo cargar el turno para editar.';
      }
    });
  }

  cargarHorariosDisponibles() {
  const fecha = this.turnoForm.get('fecha')?.value;
  const medicoId = this.turnoForm.get('medicoId')?.value;

  if (!fecha || !medicoId) {
    this.horariosDisponibles = [];
    this.actualizarEstadoHora();
    return;
  }

  this.turnoService.getHorariosDisponibles(medicoId, fecha).subscribe({
    next: (res) => {
      let lista = res.data || res;
      if (!Array.isArray(lista)) lista = [];

      const horaActual = this.turnoForm.get('hora')?.value;

      if (horaActual && !lista.includes(horaActual)) {
        lista.unshift(horaActual);
      }

      this.horariosDisponibles = lista;

      if (!horaActual) {
        this.turnoForm.get('hora')?.reset('');
      }

      this.actualizarEstadoHora();
    },
    error: () => {
      this.horariosDisponibles = [];
      this.turnoForm.get('hora')?.reset('');
      this.actualizarEstadoHora();
    }
  });
}


  volverHome() {
    this.router.navigate(['/home']);
  }

  onSubmit() {
    if (this.turnoForm.invalid) {
      this.errorMsg = 'Completá todos los campos requeridos.';
      return;
    }

    this.errorMsg = '';
    this.successMsg = '';

    if (this.modoEdicion && this.turnoId !== null) {
      this.actualizarTurno();
    } else {
      this.crearTurno();
    }
  }

  
  private crearTurno() {
    const { fecha, hora, descripcion, medicoId } = this.turnoForm.value;
    const pacienteId = this.authService.getPacienteId();

    if (!pacienteId) {
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
      duracionMin: 30
    };

    this.turnoService.crearTurno(nuevoTurno).subscribe({
      next: () => {
        this.successMsg = '✅ Turno creado con éxito. Serás redirigido al inicio en 5 segundos...';
        this.turnoForm.reset();
        this.iniciarRedireccion();
      },
      error: (msg: string) => {
        this.errorMsg = msg || 'Error al crear el turno.';
        console.error('Error al crear el turno:', msg);
      }
    });
  }

  // lógica para actualizar usando el mismo form
  private actualizarTurno() {
    const { fecha, hora, descripcion, medicoId } = this.turnoForm.value;

    const turnoActualizado = {
      fecha,
      hora,
      descripcion,
      medicoId: Number(medicoId)
      // estado: 'Pendiente',
    };

    this.turnoService.actualizarTurno(this.turnoId!, turnoActualizado).subscribe({
      next: () => {
        this.successMsg = '✅ Turno actualizado con éxito. Serás redirigido al inicio en 5 segundos...';
        this.iniciarRedireccion();
      },
      error: (err: any) => {
        const msg = typeof err === 'string' ? err : err?.message || 'Error al actualizar el turno.';
        this.errorMsg = msg;
        console.error('Error al actualizar el turno:', err);
      }
    });
  }

  private actualizarEstadoHora() {
  const horaCtrl = this.turnoForm.get('hora');

  if (!this.horariosDisponibles.length) {
    // Deshabilitar y limpiar
    horaCtrl?.reset('');
    horaCtrl?.disable({ emitEvent: false });
  } else {
    // Habilitar si hay horarios
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
