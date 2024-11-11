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
  successMessage: string | null = null; // Variable para el mensaje de éxito

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

    // Método para eliminar un turno
    eliminarTurno(turnoId: number) {
      console.log(`Intentando eliminar turno con ID: ${turnoId}`); // Asegúrate de que la función es llamada
    
      // Llamada al servicio para eliminar el turno
      this.turnoService.eliminarTurno(turnoId).subscribe(
        () => {
          console.log('Recibido el éxito de la API para eliminar el turno'); // Verifica que la respuesta de la API ha llegado correctamente
    
          // Filtrar el turno eliminado de la lista
          this.turnos = this.turnos.filter(turno => turno.id !== turnoId);
    
          // Mostrar el mensaje de éxito
          this.successMessage = `Turno con ID ${turnoId} eliminado con éxito`;
          console.log(`Turno con ID ${turnoId} eliminado con éxito`); // Verifica que este log es alcanzado
    
          // Limpiar el mensaje después de 3 segundos
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        },
        error => {
          this.error = 'Error al eliminar el turno';
          console.error('Error al eliminar el turno en el componente:', error);
        }
      );
    }
    
    

}


