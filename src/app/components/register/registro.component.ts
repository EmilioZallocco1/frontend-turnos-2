import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import {
  ObraSocialResponse,
  ObraSocial,
} from '../../models/health-insurance.interface';
import { ObraSocialService } from 'src/app/Services/health-insurance.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent implements OnInit {
  registroForm: FormGroup;
  obrasSociales: ObraSocial[] = [];
  errorMessage = '';
  successMessage = '';
  infoMessage = 'Completa tus datos para crear una cuenta.';
  cargandoObrasSociales = false;
  enviando = false;
  modoAdmin = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private obraSocialService: ObraSocialService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/),
        ],
      ],
      obraSocialId: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.modoAdmin = this.route.snapshot.data['modoAdmin'] === true;
    this.loadObrasSociales();
  }

  loadObrasSociales() {
    this.cargandoObrasSociales = true;
    this.errorMessage = '';
    this.infoMessage = 'Cargando obras sociales disponibles...';

    this.obraSocialService.getObrasSociales().subscribe({
      next: (response: ObraSocialResponse) => {
        this.obrasSociales = Array.isArray(response.data) ? response.data : [];
        this.cargandoObrasSociales = false;

        if (this.obrasSociales.length) {
          this.infoMessage = 'Selecciona la obra social y finaliza el registro.';
        } else {
          this.errorMessage = 'No se encontraron obras sociales disponibles.';
          this.infoMessage = 'No podemos continuar hasta tener una obra social.';
        }
      },
      error: () => {
        this.cargandoObrasSociales = false;
        this.errorMessage = 'No se pudieron cargar las obras sociales.';
        this.infoMessage = 'Intenta nuevamente en unos segundos.';
      },
    });
  }

  onSubmit() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      this.successMessage = '';
      this.errorMessage = this.registroForm.get('email')?.invalid
        ? 'El email no tiene un formato valido. Debe ser algo como ejemplo@mail.com.'
        : 'Por favor completa todos los campos requeridos.';
      this.infoMessage = 'Faltan datos antes de crear la cuenta.';
      return;
    }

    const { nombre, apellido, email, password, obraSocialId } =
      this.registroForm.getRawValue();

    this.enviando = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.infoMessage = this.modoAdmin
      ? 'Registrando un nuevo administrador...'
      : 'Creando tu cuenta de paciente...';

    const request$ = this.modoAdmin
      ? this.authService.registerByAdmin(
          nombre,
          apellido,
          email,
          password,
          obraSocialId,
          'admin'
        )
      : this.authService.register(
          nombre,
          apellido,
          email,
          password,
          obraSocialId
        );

    request$.subscribe({
      next: () => {
        this.enviando = false;
        this.registroForm.reset();

        if (this.modoAdmin) {
          this.successMessage = 'Usuario administrador registrado correctamente.';
          this.infoMessage = 'Redirigiendo al inicio...';
          setTimeout(() => this.router.navigate(['/home']), 1500);
        } else {
          this.successMessage = 'Registro exitoso. Ahora puedes iniciar sesion.';
          this.infoMessage = 'Redirigiendo al login...';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        }
      },
      error: (error) => {
        this.enviando = false;
        this.successMessage = '';
        this.errorMessage = error || 'Ocurrio un error al registrar.';
        this.infoMessage = 'No pudimos completar el registro.';
      },
    });
  }
}
