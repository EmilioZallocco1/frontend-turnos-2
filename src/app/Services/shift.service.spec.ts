import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TurnoService } from './shift.service';
import { environment } from 'src/environments/environment';

describe('TurnoService', () => {
  let service: TurnoService;
  let httpMock: HttpTestingController;

  const apiTurnos = `${environment.apiBaseUrl}/api/turnos`;
  const apiTurnosDisponibles = `${environment.apiBaseUrl}/api/turnos/disponibles`;
  const apiPacienteMeTurnos = `${environment.apiBaseUrl}/api/pacientes/me/turnos`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TurnoService],
    });

    service = TestBed.inject(TurnoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(service).toBeTruthy();
  });

  it('createTurno: deberia hacer POST a /api/turnos', () => {
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

  it('createTurno: si status=409 deberia devolver mensaje de conflicto', () => {
    const turno = { medicoId: 1, fecha: '2026-01-01', hora: '10:00' };

    service.createTurno(turno).subscribe({
      next: () => fail('No deberia entrar en next'),
      error: (err) => {
        // @ts-ignore - Jasmine toBeFalsy typing conflict
        expect(err).toBe('Ya existe un turno en ese horario');
      },
    });

    const req = httpMock.expectOne(apiTurnos);
    req.flush({ message: 'Ya existe un turno en ese horario' }, { status: 409, statusText: 'Conflict' });
  });

  it('createTurno: error generico deberia devolver fallback', () => {
    const turno = { medicoId: 1 };

    service.createTurno(turno).subscribe({
      next: () => fail('No deberia entrar en next'),
      error: (err) => {
        // @ts-ignore - Jasmine toBeFalsy typing conflict
        expect(err).toBe('Error en el servidor');
      },
    });

    const req = httpMock.expectOne(apiTurnos);
    req.flush({}, { status: 500, statusText: 'Server Error' });
  });

  it('getTurnosPorPaciente: deberia hacer GET a /pacientes/me/turnos sin Authorization manual', () => {
    const mockTurnos = [{ id: 1 }, { id: 2 }];

    service.getTurnosPorPaciente().subscribe(res => {
      // @ts-ignore - Jasmine toBeFalsy typing conflict
      expect(res).toEqual(mockTurnos);
    });

    const req = httpMock.expectOne(apiPacienteMeTurnos);
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(req.request.method).toBe('GET');
    // @ts-ignore - Jasmine toBeFalsy typing conflict
    expect(req.request.headers.has('Authorization')).toBeFalse();

    req.flush(mockTurnos);
  });

  it('updateTurno: deberia hacer PUT a /api/turnos/:id y enviar sanitizedInput', () => {
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

  it('getTurnosPorMedico: deberia hacer GET a /api/turnos/medico/:id', () => {
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

  it('getTurnoById: deberia hacer GET a /api/turnos/:id', () => {
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

  it('getHorariosDisponibles: deberia hacer GET a /api/turnos/disponibles con params', () => {
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
}
