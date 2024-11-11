import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegistroComponent } from './registro/registro.component'; // Corrige la importación
import { SelectorComponent } from './selector/selector.component';
import { TurnoFormComponent } from './turno-form/turno-form.component';
import {ListaTurnosComponent  } from './lista-turnos/lista-turnos.component';
import { PerfilComponent } from './perfil/perfil.component';

const routes: Routes = [
  { path: '', component: SelectorComponent },
  { path: 'pacientes/login', component: LoginComponent }, // Ruta específica para pacientes
  { path: 'medicos/login', component: LoginComponent }, // Ruta específica para médicos
  { path: 'home', component: HomeComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'turno-form', component: TurnoFormComponent },
  { path: 'listaTurnos', component:ListaTurnosComponent  },
  { path: 'perfil', component: PerfilComponent },
  { path: '**', redirectTo: '' } // Ruta por defecto
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
