import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  infoMessage = 'Ingresa tus datos para continuar.';
  role: string = 'paciente';
  enviando = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    this.role = this.route.snapshot.paramMap.get('role') || 'paciente';
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Por favor completa todos los campos correctamente.';
      this.infoMessage = 'Revisa el email y la contrasena antes de continuar.';
      return;
    }

    this.enviando = true;
    this.errorMessage = null;
    this.infoMessage = 'Validando tus credenciales...';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.infoMessage = 'Acceso concedido. Redirigiendo al inicio...';
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.enviando = false;
        this.errorMessage = error || 'Correo o contrasena incorrectos.';
        this.infoMessage = 'No pudimos iniciar sesion con esos datos.';
      },
      complete: () => {
        this.enviando = false;
      },
    });
  }
}
