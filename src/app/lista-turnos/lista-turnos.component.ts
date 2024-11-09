import { Component, OnInit } from '@angular/core';
import { TurnoService } from '../turno.service'; // Ajusta la ruta según tu estructura
import { AuthService } from '../auth.service'; // Asegúrate de importar el servicio de autenticación

@Component({
  selector: 'app-lista-turnos',
  templateUrl: './lista-turnos.component.html',
  styleUrls: ['./lista-turnos.component.scss']
})
export class ListaTurnosComponent implements OnInit {
  turnos: any[] = [];  // Array para almacenar los turnos obtenidos
  error: string | null = null;

  constructor(private turnoService: TurnoService, private authService: AuthService) {}

  ngOnInit() {
    this.obtenerTurnos();
  }

  obtenerTurnos() {
    this.turnoService.getTurnosPorPaciente().subscribe(
      (response: any) => {
        this.turnos = response.data;  // Asignamos los datos recibidos a la variable `turnos`
      },
      error => {
        this.error = error;  // En caso de error, mostramos el mensaje
        console.error('Error al obtener los turnos:', error);
      }
    );
  }
}
