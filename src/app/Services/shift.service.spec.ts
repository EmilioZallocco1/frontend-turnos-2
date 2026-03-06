import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TurnoService } from './shift.service';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

describe('TurnoService', () => {
  let service: TurnoService;
  let httpMock: HttpTestingController;

  const apiTurnos = `${environment.apiBaseUrl}/api/turnos`;
  const apiTurnosDisponibles = `${environment.apiBaseUrl}/api/turnos/disponibles`;
  const apiPacienteMeTurnos = `${environment.apiBaseUrl}/api/pacientes/me/turnos`;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj<AuthService>('AuthService', ['isLoggedIn', 'getPacienteId']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TurnoService,
        { provide: AuthService, useValue: authSpy },
      ],
    });

    service = TestBed.inject(TurnoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem('token');
  });

  it('should be created', () => {
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(service).toBeTruthy();
  });

  // ---------------- createTurno ----------------
  it('createTurno: debería hacer POST a /api/turnos', () => {
    const turno = { medicoId: 1, fecha: '2026-01-01', hora: '10:00' };
    const mockResponse = { ok: true };

    service.createTurno(turno).subscribe(res => {
        // @ts-ignore - Jasmine toBeFalsy typing conflict
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(apiTurnos);
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(req.request.method).toBe('POST');
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(req.request.body).toEqual(turno);

    req.flush(mockResponse);
  });

  it('createTurno: si status=409 debería devolver mensaje de conflicto', () => {
    const turno = { medicoId: 1, fecha: '2026-01-01', hora: '10:00' };

    service.createTurno(turno).subscribe({
      next: () => fail('No debería entrar en next'),
      error: (err) => {
        // tu service devuelve string
        // @ts-ignore - Jasmine toBeFalsy typing conflict
        expect(err).toBe('Ya existe un turno en ese horario');
      },
    });

    const req = httpMock.expectOne(apiTurnos);
    req.flush({ message: 'Ya existe un turno en ese horario' }, { status: 409, statusText: 'Conflict' });
  });

  it('createTurno: error genérico debería devolver mensaje o fallback', () => {
    const turno = { medicoId: 1 };

    service.createTurno(turno).subscribe({
      next: () => fail('No debería entrar en next'),
      error: (err) => {
        // @ts-ignore - Jasmine toBeFalsy typing conflict
        expect(err).toBe('Error en el servidor');
      },
    });

    const req = httpMock.expectOne(apiTurnos);
    req.flush({}, { status: 500, statusText: 'Server Error' });
  });

  // ---------------- getTurnosPorPaciente ----------------
  it('getTurnosPorPaciente: si no hay token debería tirar "Paciente no autenticado" y NO llamar HTTP', () => {
    localStorage.removeItem('token');

    service.getTurnosPorPaciente().subscribe({
      next: () => fail('No debería entrar en next'),
      error: (err) => {
        // @ts-ignore - Jasmine toBeFalsy typing conflict
        expect(err).toBe('Paciente no autenticado');
      },
    });

    // No debería haber requests HTTP
    httpMock.expectNone(apiPacienteMeTurnos);
  });

  it('getTurnosPorPaciente: con token debería hacer GET a /pacientes/me/turnos con Authorization', () => {
    localStorage.setItem('token', 'fake-token');

    const mockTurnos = [{ id: 1 }, { id: 2 }];

    service.getTurnosPorPaciente().subscribe(res => {
        // @ts-ignore - Jasmine toBeFalsy typing conflict
      expect(res).toEqual(mockTurnos);
    });

    const req = httpMock.expectOne(apiPacienteMeTurnos);
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(req.request.method).toBe('GET');
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');

    req.flush(mockTurnos);
  });

  // ---------------- updateTurno ----------------
  it('updateTurno: debería hacer PUT a /api/turnos/:id y enviar sanitizedInput', () => {
    const id = 10;
    const data = { estado: 'confirmado' };
    const mockResponse = { ok: true };

    service.updateTurno(id, data).subscribe(res => {
        // @ts-ignore - Jasmine toBeFalsy typing conflict
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiTurnos}/${id}`);
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(req.request.method).toBe('PUT');
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(req.request.body).toEqual({ sanitizedInput: data });

    req.flush(mockResponse);
  });



  // ---------------- getTurnosPorMedico ----------------
  it('getTurnosPorMedico: debería hacer GET a /api/turnos/medico/:id', () => {
    const medicoId = 5;
    const mockResponse = [{ id: 1 }];

    service.getTurnosPorMedico(medicoId).subscribe(res => {
        // @ts-ignore - Jasmine toBeFalsy typing conflict
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiTurnos}/medico/${medicoId}`);
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  // ---------------- getTurnoById ----------------
  it('getTurnoById: debería hacer GET a /api/turnos/:id', () => {
    const id = 99;
    const mockResponse = { id: 99 };

    service.getTurnoById(id).subscribe(res => {
        // @ts-ignore - Jasmine toBeFalsy typing conflict
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiTurnos}/${id}`);
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  // ---------------- getHorariosDisponibles ----------------
  it('getHorariosDisponibles: debería hacer GET a /api/turnos/disponibles con params medicoId y fecha', () => {
    const medicoId = 3;
    const fechaISO = '2026-01-01';
    const mockResponse = ['10:00', '10:30'];

    service.getHorariosDisponibles(medicoId, fechaISO).subscribe(res => {
        // @ts-ignore - Jasmine toBeFalsy typing conflict
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne((r) =>
      r.method === 'GET' &&
      r.url === apiTurnosDisponibles &&
      r.params.get('medicoId') === String(medicoId) &&
      r.params.get('fecha') === fechaISO
    );

    req.flush(mockResponse);
  });
});