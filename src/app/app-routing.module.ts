import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
<<<<<<< Updated upstream
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegistroComponent } from './registro/registro.component'; // Corrige la importación
import { SelectorComponent } from './selector/selector.component';
import { TurnoFormComponent } from './turno-form/turno-form.component';
import {ListaTurnosComponent  } from './lista-turnos/lista-turnos.component';
import { PerfilComponent } from './perfil/perfil.component';
import { CargarMedicoComponent } from './cargar-medico/cargar-medico.component';
import { ListaMedicosComponent } from './lista-medicos/lista-medicos.component';


const routes: Routes = [
  { path: '', component: SelectorComponent },
  { path: 'pacientes/login', component: LoginComponent }, // Ruta específica para pacientes
  { path: 'medicos/login', component: LoginComponent }, // Ruta específica para médicos
  { path: 'home', component: HomeComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'turno-form', component: TurnoFormComponent },
  { path: 'listaTurnos', component:ListaTurnosComponent  },
  { path: 'perfil', component: PerfilComponent },
  { path:  'admin/medicos', component: CargarMedicoComponent },
  { path: 'lista-medicos', component: ListaMedicosComponent },
  {path: 'cargar-medico/:id',component: CargarMedicoComponent},
=======
import { LoginComponent } from './Componentes/login/login.component';
import { HomeComponent } from './Componentes/home/home.component';
import { RegistroComponent } from './Componentes/registro/registro.component'; // Corrige la importación
import { TurnoFormComponent } from './Componentes/turno-form/turno-form.component';
import {ListaTurnosComponent  } from './Componentes/lista-turnos/lista-turnos.component';
import { PerfilComponent } from './Componentes/perfil/perfil.component';
import { CargarMedicoComponent } from './Componentes/cargar-medico/cargar-medico.component';
import { ListaMedicosComponent } from './Componentes/lista-medicos/lista-medicos.component';
import { ObraSocialFormComponent } from './Componentes/obra-social-form/obra-social-form.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { PacienteGuard } from './guards/paciente.guard';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }
, 
  //rutas publicas
  { path: 'login', component: LoginComponent }, // Ruta específica para médicos
  { path: 'registro', component: RegistroComponent },

  // rutas accesibles para cualquier usuario logueado
  { path: 'home', component: HomeComponent },
  
  // RUTAS SOLO PARA PACIENTES
  { path: 'turno-form', component: TurnoFormComponent,canActivate: [AuthGuard, PacienteGuard] },
  { path: 'turno-form/:id', component: TurnoFormComponent,canActivate: [AuthGuard, PacienteGuard] },
  { path: 'listaTurnos', component:ListaTurnosComponent,canActivate: [AuthGuard, PacienteGuard]  },
  { path: 'perfil', component: PerfilComponent,canActivate: [AuthGuard, PacienteGuard] },
   
  // RUTAS SOLO PARA ADMIN
  { path:  'admin/medicos', component: CargarMedicoComponent,canActivate: [AuthGuard, AdminGuard]},
  { path: 'lista-medicos', component: ListaMedicosComponent,canActivate: [AuthGuard, AdminGuard]},
  {path: 'cargar-medico/:id',component: CargarMedicoComponent,canActivate: [AuthGuard, AdminGuard]},
  { path: 'admin/obras-sociales/nueva', component: ObraSocialFormComponent,canActivate: [AuthGuard, AdminGuard]},
>>>>>>> Stashed changes

  { path: '**', redirectTo: '' } // Ruta por defecto
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
