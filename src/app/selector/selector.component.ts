import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-selector',
  template: `
    <div class="selector">
      <button (click)="goToLogin('paciente')">Paciente</button>
      <button (click)="goToLogin('medico')">Médico</button>
    </div>
  `,
  styleUrls: ['./selector.component.scss']
})
export class SelectorComponent {
  constructor(private router: Router) {}

  goToLogin(role: string) {
    this.router.navigate([`/login/${role}`]); // Redirige con el rol seleccionado
  }
}
