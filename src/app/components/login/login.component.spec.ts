/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../Services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { LoginResponse } from '../../models/login-response.interface';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    // Crear un spy del AuthService
    
    const spy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    // @ts-ignore - Jasmine toBeTruthy typing conflict
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con campos requeridos', () => {
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(component.loginForm).toBeDefined();
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(component.loginForm.get('email')).toBeDefined();
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(component.loginForm.get('password')).toBeDefined();
  });

  it('debería tener el formulario inválido inicialmente', () => {
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('debería validar email correctamente', () => {
    const emailControl = component.loginForm.get('email');

    // Email vacío - inválido
    emailControl?.setValue('');
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(emailControl?.valid).toBeFalsy();

    // Email inválido - inválido
    emailControl?.setValue('invalid-email');
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(emailControl?.valid).toBeFalsy();

    // Email válido - válido
    emailControl?.setValue('usuario@example.com');
    // @ts-ignore - Jasmine toBeTruthy typing conflict
    expect(emailControl?.valid).toBeTruthy();
  });

  it('debería validar password correctamente', () => {
    const passwordControl = component.loginForm.get('password');

    // Password vacío - inválido
    passwordControl?.setValue('');
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(passwordControl?.valid).toBeFalsy();

    // Password corto - inválido
    passwordControl?.setValue('12345');
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(passwordControl?.valid).toBeFalsy();

    // Password válido - válido
    passwordControl?.setValue('123456');
    // @ts-ignore - Jasmine toBeTruthy typing conflict
    expect(passwordControl?.valid).toBeTruthy();
  });

  it('debería tener el formulario válido con datos correctos', () => {
    component.loginForm.patchValue({
      email: 'usuario@example.com',
      password: 'password123'
    });
    // @ts-ignore - Jasmine toBeTruthy typing conflict
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('debería llamar al servicio de login cuando el formulario es válido', () => {
    // Configurar el spy para devolver un observable exitoso con la estructura correcta de LoginResponse
    const mockLoginResponse: LoginResponse = {
      message: 'Login exitoso',
      data: {
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'usuario@example.com'
      },
      token: 'fake-token'
    };
    authServiceSpy.login.and.returnValue(of(mockLoginResponse));

    component.loginForm.patchValue({
      email: 'usuario@example.com',
      password: 'password123'
    });

    component.onSubmit();

    // @ts-ignore - Jasmine toHaveBeenCalled typing conflict
    expect(authServiceSpy.login).toHaveBeenCalledWith('usuario@example.com', 'password123');
  });

  it('no debería llamar al servicio de login cuando el formulario es inválido', () => {
    component.loginForm.patchValue({
      email: 'invalid-email',
      password: ''
    });

    component.onSubmit();

    // @ts-ignore - Jasmine not.toHaveBeenCalled typing conflict
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('debería mostrar mensaje de error cuando el login falla', () => {
    authServiceSpy.login.and.returnValue(throwError(() => ({ message: 'Credenciales inválidas' })));

    component.loginForm.patchValue({
      email: 'usuario@example.com',
      password: 'wrongpassword'
    });

    component.onSubmit();
// @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(component.errorMessage).toBe('Credenciales inválidas');
  });

  it('debería mostrar mensaje de validación cuando el formulario es inválido', () => {
    component.loginForm.patchValue({
      email: '',
      password: ''
    });

    component.onSubmit();
// @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(component.errorMessage).toBe('Por favor completa todos los campos correctamente.');
  });
});

    
