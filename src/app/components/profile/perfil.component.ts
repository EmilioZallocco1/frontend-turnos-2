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
    this.getPerfil();
  }

getPerfil() {
  this.pacienteService.getPacienteData().subscribe({
    next: (response) => {
      // si el backend devuelve {message, data}
      this.paciente = response.data ?? response;
      this.error = null;
    },
    error: (err) => {
      this.error = err?.error?.message || 'Error al cargar el perfil';
      console.error('Error:', err);
    }
  });
}
  updatePerfil() {
    this.pacienteEditando = { ...this.paciente };
    this.editandoPerfil = true;
  }

  cancelarEdicion() {
    this.editandoPerfil = false;
    this.pacienteEditando = null;
  }

guardarPerfilActualizado() {
  if (!this.pacienteEditando) {
    this.error = 'No hay datos para actualizar';
    return;
  }

  this.pacienteService.updatePaciente(this.pacienteEditando).subscribe({
    next: () => {
      this.successMessage = 'Perfil actualizado con éxito';
      this.error = null;
      this.paciente = { ...this.pacienteEditando };
      this.editandoPerfil = false;
      setTimeout(() => (this.successMessage = null), 3000);
    },
    error: (err) => {
      this.error = err?.error?.message || 'Error al actualizar el perfil';
      console.error('Error:', err);
    }
  });
}

deleteCuenta() {
  const confirmado = confirm(
    '¿Estás seguro de que querés eliminar tu cuenta? Esta acción no se puede deshacer.'
  );
  if (!confirmado) return;

  this.pacienteService.deletePaciente().subscribe({
    next: () => {
      this.authService.logout();
      this.router.navigate(['/login']);
    },
    error: (err) => {
      this.error = err?.error?.message || 'Error al eliminar la cuenta';
      console.error('Error:', err);
    }
  });
}

logout(): void {
  this.authService.logout();
  this.router.navigate(['/login']);
}

  
  goBack() {
    this.location.back();  
  }
}
