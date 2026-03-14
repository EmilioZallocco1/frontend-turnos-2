/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../Services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
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

  it('deberia crear el componente', () => {
    // @ts-ignore - Jasmine toBeTruthy typing conflict
    expect(component).toBeTruthy();
  });

  it('deberia inicializar el formulario con campos requeridos', () => {
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(component.loginForm).toBeDefined();
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(component.loginForm.get('email')).toBeDefined();
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(component.loginForm.get('password')).toBeDefined();
  });

  it('deberia tener el formulario invalido inicialmente', () => {
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('deberia validar email correctamente', () => {
    const emailControl = component.loginForm.get('email');

    emailControl?.setValue('');
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(emailControl?.valid).toBeFalsy();

    emailControl?.setValue('invalid-email');
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(emailControl?.valid).toBeFalsy();

    emailControl?.setValue('usuario@example.com');
    // @ts-ignore - Jasmine toBeTruthy typing conflict
    expect(emailControl?.valid).toBeTruthy();
  });

  it('deberia validar password correctamente', () => {
    const passwordControl = component.loginForm.get('password');

    passwordControl?.setValue('');
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(passwordControl?.valid).toBeFalsy();

    passwordControl?.setValue('12345');
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(passwordControl?.valid).toBeFalsy();

    passwordControl?.setValue('123456');
    // @ts-ignore - Jasmine toBeTruthy typing conflict
    expect(passwordControl?.valid).toBeTruthy();
  });

  it('deberia tener el formulario valido con datos correctos', () => {
    component.loginForm.patchValue({
      email: 'usuario@example.com',
      password: 'password123'
    });
    // @ts-ignore - Jasmine toBeTruthy typing conflict
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('deberia llamar al servicio de login cuando el formulario es valido', () => {
    authServiceSpy.login.and.returnValue(of({
      id: 1,
      nombre: 'Juan',
      apellido: 'Perez',
      email: 'usuario@example.com'
    }));

    component.loginForm.patchValue({
      email: 'usuario@example.com',
      password: 'password123'
    });

    component.onSubmit();

    // @ts-ignore - Jasmine toHaveBeenCalled typing conflict
    expect(authServiceSpy.login).toHaveBeenCalledWith('usuario@example.com', 'password123');
  });

  it('no deberia llamar al servicio de login cuando el formulario es invalido', () => {
    component.loginForm.patchValue({
      email: 'invalid-email',
      password: ''
    });

    component.onSubmit();

    // @ts-ignore - Jasmine not.toHaveBeenCalled typing conflict
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('deberia mostrar mensaje de error cuando el login falla', () => {
    authServiceSpy.login.and.returnValue(throwError(() => ({ message: 'Credenciales invalidas' })));

    component.loginForm.patchValue({
      email: 'usuario@example.com',
      password: 'wrongpassword'
    });

    component.onSubmit();
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(component.errorMessage).toBe('Credenciales invalidas');
  });

  it('deberia mostrar mensaje de validacion cuando el formulario es invalido', () => {
    component.loginForm.patchValue({
      email: '',
      password: ''
    });

    component.onSubmit();
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(component.errorMessage).toBe('Por favor completa todos los campos correctamente.');
  });
});
