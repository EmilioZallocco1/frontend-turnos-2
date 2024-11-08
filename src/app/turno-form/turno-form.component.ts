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
  medicos: any[] = []; // Almacena la lista de médicos

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

  // Cargar la lista de médicos usando el servicio
  loadMedicos() {
    this.obraSocialService.getMedicos().subscribe(
      (response) => {
        this.medicos = response.data;
        console.log('Médicos cargados:', this.medicos); // Verifica que los médicos se carguen
      },
      (error) => {
        console.error('Error al cargar médicos:', error);
      }
    );
  }
  
  onSubmit() {
    if (this.turnoForm.valid) {
      const { fecha, hora, descripcion, medicoId } = this.turnoForm.value;
      const pacienteId = this.authService.getPacienteId(); // Obtener el ID del paciente autenticado

      // Comprobar los valores de `pacienteId` y `medicoId` antes de continuar
      console.log('ID del paciente:', pacienteId);
      console.log('ID del médico (sin conversión):', medicoId);

      // Validar que pacienteId y medicoId existan y sean numéricos
      if (pacienteId === null || pacienteId === undefined) {
        console.error('Error: El pacienteId es nulo o indefinido.');
        return;
      }
      if (medicoId === null || medicoId === undefined) {
        console.error('Error: El medicoId es nulo o indefinido.');
        return;
      }

      const nuevoTurno = {
        fecha,
        hora,
        estado: 'Pendiente', // Estado inicial
        descripcion,
        medicoId: Number(medicoId), // Asegúrate de convertir a número
        pacienteId // Asigna el paciente
      };

      console.log('Datos del turno a enviar:', nuevoTurno);

      this.turnoService.crearTurno(nuevoTurno).subscribe(
        response => {
          console.log('Turno creado exitosamente:', response);
          this.router.navigate(['/home']); // Redirige a la página principal o a donde desees
        },
        error => {
          console.error('Error al crear el turno:', error);
        }
      );
    } else {
      console.log('Formulario inválido');
    }
  }
}
