import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from './loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loadingService.show(this.getRequestMessage(req));

    return next.handle(req).pipe(
      finalize(() => {
        this.loadingService.hide();
      })
    );
  }

  private getRequestMessage(req: HttpRequest<any>): string {
    const url = req.url.toLowerCase();

    if (url.includes('/login')) {
      return 'Iniciando sesion...';
    }

    if (url.includes('/register')) {
      return 'Creando tu cuenta...';
    }

    if (url.includes('/turnos/disponibles')) {
      return 'Buscando horarios disponibles...';
    }

    if (url.includes('/turnos')) {
      if (req.method === 'POST') {
        return 'Guardando el turno...';
      }
      if (req.method === 'PUT') {
        return 'Actualizando el turno...';
      }
      if (req.method === 'DELETE') {
        return 'Eliminando el turno...';
      }
      return 'Cargando turnos...';
    }

    if (url.includes('/medicos')) {
      if (req.method === 'POST') {
        return 'Registrando medico...';
      }
      if (req.method === 'PUT') {
        return 'Guardando cambios del medico...';
      }
      if (req.method === 'DELETE') {
        return 'Eliminando medico...';
      }
      return 'Cargando medicos...';
    }

    if (url.includes('/obras-sociales')) {
      return 'Cargando obras sociales...';
    }

    return req.method === 'GET'
      ? 'Cargando informacion...'
      : 'Procesando solicitud...';
  }
}
