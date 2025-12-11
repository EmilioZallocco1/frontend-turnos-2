import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  role: string = 'paciente'; // Rol por defecto

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute, // Para obtener parámetros de la URL
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    // Obtiene el rol de la URL
    this.role = this.route.snapshot.paramMap.get('role') || 'paciente';
    console.log('Rol de usuario:', this.role); // Para verificar si es paciente o medico
  }

 onSubmit() {
  console.log('Formulario enviado', this.loginForm);
  if (this.loginForm.valid) {
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        console.log("RESPUESTA LOGIN:", response);
        // El token ya fue guardado por el AuthService
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.errorMessage =
          error?.message || 'Correo o contraseña son incorrectos.';
      }
    });

  } else {
    console.log('Form is invalid');
    this.errorMessage = 'Por favor completa todos los campos correctamente.';
  }
}

}
