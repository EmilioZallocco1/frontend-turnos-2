import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PacienteService } from './patient.service';
import { environment } from 'src/environments/environment';

describe('PacienteService', () => {
  let service: PacienteService;
  let httpMock: HttpTestingController;

  const baseUrl = `${environment.apiBaseUrl}/api/pacientes`;
  const meUrl = `${baseUrl}/me`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PacienteService],
    });

    service = TestBed.inject(PacienteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // asegura que no queden requests colgadas
    httpMock.verify();
  });

  it('should be created', () => {
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(service).toBeTruthy();
  });

  // ------------------- getPacienteData -------------------
  it('getPacienteData: debería hacer GET a /me y devolver los datos', () => {
    const mockResponse = { id: 1, nombre: 'Emilio' };

    service.getPacienteData().subscribe((res) => {
        // @ts-ignore - Jasmine toBeFalsy typing conflict
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(meUrl);
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('getPacienteData: si hay error, debería devolver el mensaje del backend', () => {
    service.getPacienteData().subscribe({
      next: () => fail('No debería entrar en next'),
      error: (err) => {
        // tu catchError devuelve string
        // @ts-ignore - Jasmine toBeFalsy typing conflict
        expect(err).toBe('Token inválido');
      },
    });

    const req = httpMock.expectOne(meUrl);
    req.flush({ message: 'Token inválido' }, { status: 401, statusText: 'Unauthorized' });
  });

  it('getPacienteData: si no hay message, devuelve fallback', () => {
    service.getPacienteData().subscribe({
      next: () => fail('No debería entrar en next'),
      error: (err) => {
        // @ts-ignore - Jasmine toBeFalsy typing conflict
        expect(err).toBe('Error en el servidor');
      },
    });

    const req = httpMock.expectOne(meUrl);
    req.flush({}, { status: 500, statusText: 'Server Error' });
  });

  // ------------------- updatePaciente -------------------
  it('updatePaciente: debería hacer PUT a /me con el body correcto', () => {
    const body = { telefono: '123' };
    const mockResponse = { ok: true };

    service.updatePaciente(body).subscribe((res) => {
        // @ts-ignore - Jasmine toBeFalsy typing conflict
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(meUrl);
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(req.request.method).toBe('PUT');
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(req.request.body).toEqual(body);

    req.flush(mockResponse);
  });

  // ------------------- deletePaciente -------------------
 it('deletePaciente: debería hacer DELETE a /me', () => {
  service.deletePaciente().subscribe();

  const req = httpMock.expectOne(meUrl);
  // @ts-ignore - Jasmine toBeFalsy typing conflict
  expect(req.request.method).toBe('DELETE');

  req.flush(null);
});

  it('deletePaciente: si hay error, debería devolver el mensaje del backend', () => {
    service.deletePaciente().subscribe({
      next: () => fail('No debería entrar en next'),
      error: (err) => {
        // @ts-ignore - Jasmine toBeFalsy typing conflict
        expect(err).toBe('No autorizado');
      },
    });

    const req = httpMock.expectOne(meUrl);
    req.flush({ message: 'No autorizado' }, { status: 401, statusText: 'Unauthorized' });
  });
});