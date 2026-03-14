import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { PerfilComponent } from './perfil.component';
import { PacienteService } from 'src/app/Services/patient.service';
import { AuthService } from '../../Services/auth.service';

describe('PerfilComponent (simple)', () => {
  let component: PerfilComponent;
  let fixture: ComponentFixture<PerfilComponent>;

  let pacienteServiceSpy: jasmine.SpyObj<PacienteService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let locationSpy: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    pacienteServiceSpy = jasmine.createSpyObj<PacienteService>('PacienteService', [
      'getPacienteData',
      'updatePaciente',
      'deletePaciente',
    ]);
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['logout', 'clearSession']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
    locationSpy = jasmine.createSpyObj<Location>('Location', ['back']);

    await TestBed.configureTestingModule({
      declarations: [PerfilComponent],
      providers: [
        { provide: PacienteService, useValue: pacienteServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;
  });

  it('deberia crear el componente', () => {
    // @ts-ignore - Jasmine toBeTruthy typing conflict
    expect(component).toBeTruthy();
  });

  it('ngOnInit deberia llamar a getPerfil()', () => {
    spyOn(component, 'getPerfil');
    component.ngOnInit();
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(component.getPerfil).toHaveBeenCalled();
  });

  it('getPerfil success: deberia setear paciente y limpiar error', () => {
    pacienteServiceSpy.getPacienteData.and.returnValue(
      of({ data: { nombre: 'Emilio', email: 'e@e.com' } })
    );

    component.getPerfil();
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(pacienteServiceSpy.getPacienteData).toHaveBeenCalled();
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(component.paciente).toEqual({ nombre: 'Emilio', email: 'e@e.com' });
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(component.error).toBeNull();
  });

  it('getPerfil error: deberia setear error', () => {
    pacienteServiceSpy.getPacienteData.and.returnValue(
      throwError(() => ({ error: { message: 'Fallo' } }))
    );

    component.getPerfil();
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(component.error).toBe('Fallo');
  });

  it('logout: deberia llamar authService.logout y navegar a /login', () => {
    authServiceSpy.logout.and.returnValue(of(void 0));

    component.logout();
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(authServiceSpy.logout).toHaveBeenCalled();
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('goBack: deberia volver atras', () => {
    component.goBack();
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(locationSpy.back).toHaveBeenCalled();
  });
}
