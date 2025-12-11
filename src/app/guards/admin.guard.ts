import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {

    // Usa el rol que viene del JWT, no del currentUser editable
    if (this.authService.esAdmin()) {
      return true;
    }

    // Si no es admin, lo saco (podés mandarlo a /home o /login)
    return this.router.createUrlTree(['/home']);
  }
}
