import { Component, OnInit } from '@angular/core';
import { PacienteService } from 'src/app/Services/patient.service';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';  

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  paciente: any = {};
  pacienteEditando: any = null;
  editandoPerfil: boolean = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(
    private pacienteService: PacienteService,
    private authService: AuthService,
    private router: Router,
    private location: Location 
  ) {}

  ngOnInit() {
    this.obtenerPerfil();
  }

  obtenerPerfil() {
    const pacienteId = this.authService.getPacienteId();
    if (pacienteId !== null) {
      this.pacienteService.getPacienteData().subscribe(
        (response) => {
          this.paciente = response.data;
          this.error = null;
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
    this.pacienteEditando = { ...this.paciente };
    this.editandoPerfil = true;
  }

  cancelarEdicion() {
    this.editandoPerfil = false;
    this.pacienteEditando = null;
  }

  guardarPerfilActualizado() {
    const pacienteId = this.authService.getPacienteId();
    if (pacienteId !== null && this.pacienteEditando) {
      this.pacienteService.actualizarPaciente(pacienteId, this.pacienteEditando).subscribe(
        () => {
          this.successMessage = 'Perfil actualizado con éxito';
          this.error = null;
          this.paciente = { ...this.pacienteEditando };
          this.editandoPerfil = false;
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
  const confirmado = confirm(
    '¿Estás seguro de que querés eliminar tu cuenta? Esta acción no se puede deshacer.'
  );

  if (!confirmado) {
    return; // El usuario canceló
  }

  const pacienteId = this.authService.getPacienteId();

  if (pacienteId !== null) {
    this.pacienteService.eliminarPaciente(pacienteId).subscribe(
      () => {
        this.router.navigate(['/']);
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


  
  goBack() {
    this.location.back();  
  }
}
