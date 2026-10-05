import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { AuthService } from '../Services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['isLoggedIn']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('deberia crear el guard', () => {
    // @ts-ignore - Jasmine toBeTruthy typing conflict
    expect(guard).toBeTruthy();
  });

  it('usuario logueado: canActivate deberia devolver true', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);

    const result = guard.canActivate(
      {} as ActivatedRouteSnapshot,
      { url: '/perfil' } as RouterStateSnapshot
    );

    // @ts-ignore - Jasmine toBe typing conflict
    expect(result).toBe(true);
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(routerSpy.createUrlTree).not.toHaveBeenCalled();
  });

  it('usuario no logueado: canActivate deberia redirigir a /login con returnUrl', () => {
    authServiceSpy.isLoggedIn.and.returnValue(false);
    const fakeUrlTree = {} as any;
    routerSpy.createUrlTree.and.returnValue(fakeUrlTree);

    const result = guard.canActivate(
      {} as ActivatedRouteSnapshot,
      { url: '/perfil' } as RouterStateSnapshot
    );

    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/perfil' },
    });
    // @ts-ignore - Jasmine toBe typing conflict
    expect(result).toBe(fakeUrlTree);
  });
});
