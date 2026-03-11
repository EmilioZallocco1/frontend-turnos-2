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

  page = 1;
  limit = 5;
  total = 0;
  totalPages = 0;

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
          
          // opcional: volver a primera página para ver la nueva carga
          this.page = 1;
          this.verObrasSociales(); // refrescar lista
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
    this.service.listar(this.page, this.limit).subscribe({
      next: (resp) => {
        this.obrasSociales = resp.data;
        this.total = resp.total;
        this.totalPages = resp.totalPages;
        this.page = resp.page; // actualizar página actual
        this.limit = resp.limit; // actualizar límite actual
      },
      error: (e) => {
        console.error('Error al cargar obras sociales:', e);
      }
    });
  }


  paginaSiguiente() {
    if (this.page < this.totalPages) {
      this.page++;
      this.verObrasSociales();
    }
  }

  paginaAnterior() {
    if (this.page > 1) {
      this.page--;
      this.verObrasSociales();
    }
  }

  
  // Método para el botón (agregado al final)
  goBack() {
    this.location.back();  // Vuelve a la página anterior (como en perfil)
  }
}