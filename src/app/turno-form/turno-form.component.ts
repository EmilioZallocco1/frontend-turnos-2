import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  errorMsg = '';
  successMsg = '';
  redirectCountdown = 0; // segundos restantes antes de redirigir

  constructor(
    private fb: FormBuilder,
    private turnoService: TurnoService,
    private authService: AuthService,
    private obraSocialService: ObraSocialService,
    private router: Router
  ) {
    this.turnoForm = this.fb.group({
      fecha: ['', [Validators.required]],
      hora: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      medicoId: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadMedicos();
  }

  loadMedicos() {
    this.obraSocialService.getMedicos().subscribe({
      next: (response) => (this.medicos = response.data),
      error: (error) => console.error('Error al cargar médicos:', error)
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

    this.errorMsg = '';
    this.successMsg = '';

    this.turnoService.crearTurno(nuevoTurno).subscribe({
      next: () => {
        this.successMsg = '✅ Turno creado con éxito. Serás redirigido al inicio en 5 segundos...';
        this.turnoForm.reset();

        // 🔁 Iniciar cuenta regresiva de 5s
        this.redirectCountdown = 5;
        const interval = setInterval(() => {
          this.redirectCountdown--;
          if (this.redirectCountdown === 0) {
            clearInterval(interval);
            this.router.navigate(['/home']);
          }
        }, 1000);
      },
      error: (msg: string) => {
        this.errorMsg = msg || 'Error al crear el turno.';
        console.error('Error al crear el turno:', msg);
      }
    });
  }
}
