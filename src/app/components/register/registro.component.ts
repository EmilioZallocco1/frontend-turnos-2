import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service'; // Servicio de autenticación
import { ObraSocialService } from 'src/app/Services/health-insurance.service'; // Servicio de obra social
import { Router } from '@angular/router';
import { ObraSocialResponse } from '../../models/health-insurance.interface'; // Importa la interfaz

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent implements OnInit {
  registroForm: FormGroup;
  obrasSociales: any[] = []; // Para almacenar las obras sociales
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private obraSocialService: ObraSocialService,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      obraSocialId: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.loadObrasSociales(); // Cargar las obras sociales al inicializar el componente
  }

  loadObrasSociales() {
    this.obraSocialService.getObrasSociales().subscribe(
      (response: ObraSocialResponse) => {
        if (response.data && Array.isArray(response.data)) {
          this.obrasSociales = response.data;
          console.log('Obras sociales:', this.obrasSociales); // Verifica que esto sea un arrayyy
        } else {
          this.errorMessage = 'No se encontraron obras sociales.';
        }
      },
      (error) => {
        console.error('Error al cargar obras sociales', error);
        this.errorMessage = 'No se pudieron cargar las obras sociales.';
      }
    );
  }

  onSubmit() {
    if (this.registroForm.valid) {
      const { nombre, apellido, email, password, obraSocialId } =
        this.registroForm.value;

      this.authService
        .register(nombre, apellido, email, password, obraSocialId)
        .subscribe(
          (response) => {
            console.log('Registro exitoso:', response);
            this.successMessage = 'Registro exitoso. Por favor, inicie sesión.';
            this.registroForm.reset();
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          },
          (error) => {
            console.error('Error en el registro:', error);
            this.errorMessage = error;
          }
        );
    } else {
      console.log('Formulario inválido');
      this.errorMessage = 'Por favor, complete todos los campos requeridos.';
    }
  }
}
