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
  success = false;

  showPassword = false;
  capsLockOn = false;

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

  get isMedico(): boolean {
    return this.role.toLowerCase().startsWith('medic');
  }

  get roleLabel(): string {
    return this.isMedico ? 'Médico' : 'Paciente';
  }

  get roleIcon(): string {
    return this.isMedico ? 'bi-heart-pulse' : 'bi-person-heart';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onPasswordKeydown(event: KeyboardEvent) {
    if (typeof event.getModifierState === 'function') {
      this.capsLockOn = event.getModifierState('CapsLock');
    }
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
        this.success = true;
        this.infoMessage = 'Acceso concedido. Redirigiendo al inicio...';
        setTimeout(() => this.router.navigate(['/home']), 600);
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
