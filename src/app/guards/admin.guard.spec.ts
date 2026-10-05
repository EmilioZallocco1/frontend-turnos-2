import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { AdminGuard } from './admin.guard';
import { AuthService } from '../Services/auth.service';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['esAdmin']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(AdminGuard);
  });

  it('deberia crear el guard', () => {
    // @ts-ignore - Jasmine toBeTruthy typing conflict
    expect(guard).toBeTruthy();
  });

  it('usuario admin: canActivate deberia devolver true', () => {
    authServiceSpy.esAdmin.and.returnValue(true);

    const result = guard.canActivate(
      {} as ActivatedRouteSnapshot,
      { url: '/admin/medicos' } as RouterStateSnapshot
    );

    // @ts-ignore - Jasmine toBe typing conflict
    expect(result).toBe(true);
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(routerSpy.createUrlTree).not.toHaveBeenCalled();
  });

  it('usuario no admin: canActivate deberia redirigir a /home', () => {
    authServiceSpy.esAdmin.and.returnValue(false);
    const fakeUrlTree = {} as any;
    routerSpy.createUrlTree.and.returnValue(fakeUrlTree);

    const result = guard.canActivate(
      {} as ActivatedRouteSnapshot,
      { url: '/admin/medicos' } as RouterStateSnapshot
    );

    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/home']);
    // @ts-ignore - Jasmine toBe typing conflict
    expect(result).toBe(fakeUrlTree);
  });
});
