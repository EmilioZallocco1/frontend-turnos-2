// obra-social.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ObraSocialResponse } from './models/obra-social.interface';

@Injectable({
  providedIn: 'root'
})
export class ObraSocialService {
  private apiUrl = 'http://localhost:3000/api/obrasSocial'; // Cambia esto a tu URL de API

  constructor(private http: HttpClient) { }

  getObrasSociales(): Observable<ObraSocialResponse> {
    return this.http.get<ObraSocialResponse>(this.apiUrl);
  }
}
