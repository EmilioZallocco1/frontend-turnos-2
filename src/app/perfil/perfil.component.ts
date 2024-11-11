import { Component, OnInit } from '@angular/core';
import { PacienteService } from '../paciente.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  paciente: any = {}; // Variable para almacenar los datos del paciente
  error: string | null = null;
  successMessage: string | null = null;

  constructor(
    private pacienteService: PacienteService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.obtenerPerfil(); // Llama a obtenerPerfil al cargar el componente
  }

  obtenerPerfil() {
    const pacienteId = this.authService.getPacienteId();
    if (pacienteId !== null) {
      this.pacienteService.getPacienteData().subscribe(
        (response) => {
          console.log('Datos del paciente recibidos:', response);
          this.paciente = response.data; // Asigna los datos del paciente a la propiedad
        },
        (error) => {
          this.error = 'Error al cargar el perfil';
          console.error('Error:', error);
        }
      );
    } else {
      this.error = 'ID de paciente no disponible';
    }
  }
  
  actualizarPerfil() {
    const pacienteId = this.authService.getPacienteId();
    if (pacienteId !== null) {  // Verifica que el ID no sea null
      this.pacienteService.actualizarPaciente(pacienteId, this.paciente).subscribe(
        () => {
          this.successMessage = 'Perfil actualizado con éxito';
          setTimeout(() => (this.successMessage = null), 3000);
        },
        (error) => {
          this.error = 'Error al actualizar el perfil';
          console.error('Error:', error);
        }
      );
    } else {
      this.error = 'ID de paciente no disponible';
    }
  }
  
  eliminarCuenta() {
    const pacienteId = this.authService.getPacienteId();
    if (pacienteId !== null) {  // Verifica que el ID no sea null
      this.pacienteService.eliminarPaciente(pacienteId).subscribe(
        () => {
          this.router.navigate(['/']); // Redirige a la página de inicio después de eliminar la cuenta
        },
        (error) => {
          this.error = 'Error al eliminar la cuenta';
          console.error('Error:', error);
        }
      );
    } else {
      this.error = 'ID de paciente no disponible';
    }
  }
  
}
