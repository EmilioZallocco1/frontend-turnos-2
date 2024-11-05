import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service'; // Importa el servicio de autenticación

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null; // Propiedad para el mensaje de error

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService // Inyecta el servicio
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    console.log('Formulario enviado', this.loginForm); // Depurar si el método se ejecuta
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe(
        response => {
          console.log('Login exitoso:', response);
          // \guardar el token si está presente en la respuesta
          // localStorage.setItem('token', response.token);

          // Redirige al usuario después de un inicio de sesión exitoso
          this.router.navigate(['/home']);
        },
        error => {
          console.error('Login failed:', error);
          this.errorMessage = error.message || 'Correo o contraseña son incorrectos.'; // Asigna el mensaje de error
        }
      );
    } else {
      console.log('Form is invalid');
      this.errorMessage = 'Por favor completa todos los campos correctamente.'; // Mensaje de error para formulario inválido
    }
  }
}
