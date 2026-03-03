import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';  // Import agregado para goBack
import { ObraSocialService } from 'src/app/Services/health-insurance.service';
import { ObraSocial } from '../../models/health-insurance.interface'; // ajustá la ruta si difiere

@Component({
  selector: 'app-obra-social-form',
  templateUrl: './obra-social-form.component.html',
  styleUrls: ['./obra-social-form.component.scss']
})
export class ObraSocialFormComponent implements OnInit {

  cargando = false;
  errorMsg = '';
  obrasSociales: ObraSocial[] = []; // 👈 lista de obras sociales

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
  });

  constructor(
    private fb: FormBuilder,
    private service: ObraSocialService,
    private router: Router,
    private location: Location  // Inyectado para goBack
  ) {}

  ngOnInit(): void {
    // opcional: cargar lista al iniciar
    this.verObrasSociales();
  }

  submit() {
    this.errorMsg = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando = true;
    const { nombre } = this.form.value as { nombre: string };

    this.service.register({ nombre })
      .subscribe({
        next: () => {
          this.cargando = false;
          alert('Obra social registrada con éxito');
          this.form.reset();
          this.verObrasSociales(); // 🔄 refrescar lista
        },
        error: (e) => {
          this.cargando = false;
          this.errorMsg = e?.error?.message ?? 'No se pudo registrar la obra social';
        }
      });
  }

  cancelar() {
    this.router.navigate(['/home']);
  }

  verObrasSociales() {
    this.service.listar().subscribe({
      next: (data) => {
        this.obrasSociales = data;
      },
      error: (e) => {
        console.error('Error al cargar obras sociales:', e);
      }
    });
  }

  // Método para el botón (agregado al final)
  goBack() {
    this.location.back();  // Vuelve a la página anterior (como en perfil)
  }
}