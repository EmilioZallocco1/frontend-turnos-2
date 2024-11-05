import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegistroComponent } from './registro/registro.component'; // Corrige la importación
import { SelectorComponent } from './selector/selector.component';

const routes: Routes = [
  { path: '', component: SelectorComponent },
  { path: 'login/:role', component: LoginComponent }, // Ruta con el parámetro de rol
  { path: 'home', component: HomeComponent },
  { path: 'registro', component: RegistroComponent },
  { path: '**', redirectTo: '' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
