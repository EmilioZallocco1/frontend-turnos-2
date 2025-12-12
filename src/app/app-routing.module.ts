import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RegistroComponent } from './components/register/registro.component';
import { TurnoFormComponent } from './components/shift-form/turno-form.component';
import { ListaTurnosComponent } from './components/list-shift/lista-turnos.component';
import { PerfilComponent } from './components/profile/perfil.component';
import { CargarMedicoComponent } from './components/load-doctor/cargar-medico.component';
import { ListaMedicosComponent } from './components/list-doctor/lista-medicos.component';
import { ObraSocialFormComponent } from './components/health-insurance-form/obra-social-form.component';

import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { PacienteGuard } from './guards/patient.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Rutas públicas
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },

  // Rutas accesibles para cualquier usuario logueado
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },

  // RUTAS SOLO PARA PACIENTES
  { path: 'turno-form', component: TurnoFormComponent, canActivate: [AuthGuard, PacienteGuard] },
  { path: 'turno-form/:id', component: TurnoFormComponent, canActivate: [AuthGuard, PacienteGuard] },
  { path: 'listaTurnos', component: ListaTurnosComponent, canActivate: [AuthGuard, PacienteGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard, PacienteGuard] },

  // RUTAS SOLO PARA ADMIN
  { path: 'admin/medicos', component: CargarMedicoComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'lista-medicos', component: ListaMedicosComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'cargar-medico/:id', component: CargarMedicoComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/obras-sociales/nueva', component: ObraSocialFormComponent, canActivate: [AuthGuard, AdminGuard] },

  { path: '**', redirectTo: '' } // Ruta por defecto
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
