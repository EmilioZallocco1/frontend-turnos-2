import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Componentes/login/login.component';
import { HomeComponent } from './Componentes/home/home.component';
import { RegistroComponent } from './Componentes/registro/registro.component'; // Corrige la importación
import { TurnoFormComponent } from './Componentes/turno-form/turno-form.component';
import {ListaTurnosComponent  } from './Componentes/lista-turnos/lista-turnos.component';
import { PerfilComponent } from './Componentes/perfil/perfil.component';
import { CargarMedicoComponent } from './Componentes/cargar-medico/cargar-medico.component';
import { ListaMedicosComponent } from './Componentes/lista-medicos/lista-medicos.component';
import { ObraSocialFormComponent } from './Componentes/obra-social-form/obra-social-form.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }
,
  { path: 'login', component: LoginComponent }, // Ruta específica para médicos
  { path: 'home', component: HomeComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'turno-form', component: TurnoFormComponent },
  { path: 'turno-form/:id', component: TurnoFormComponent },
  { path: 'listaTurnos', component:ListaTurnosComponent  },
  { path: 'perfil', component: PerfilComponent },
  { path:  'admin/medicos', component: CargarMedicoComponent },
  { path: 'lista-medicos', component: ListaMedicosComponent },
  {path: 'cargar-medico/:id',component: CargarMedicoComponent},
  { path: 'admin/obras-sociales/nueva', component: ObraSocialFormComponent },

  { path: '**', redirectTo: '' } // Ruta por defecto
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
