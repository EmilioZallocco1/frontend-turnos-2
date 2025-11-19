import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Componentes/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './Componentes/home/home.component';
import { HttpClientModule } from '@angular/common/http'; // Importa HttpClientModule
import { RouterModule } from '@angular/router';
import { RegistroComponent } from './Componentes/registro/registro.component';
import { SelectorComponent } from './Componentes/selector/selector.component';
import { TurnoFormComponent } from './Componentes/turno-form/turno-form.component';
import { ListaTurnosComponent } from './Componentes/lista-turnos/lista-turnos.component';
import { PerfilComponent } from './Componentes/perfil/perfil.component';
import { CargarMedicoComponent } from './Componentes/cargar-medico/cargar-medico.component';
import { ListaMedicosComponent } from './Componentes/lista-medicos/lista-medicos.component';
import { ObraSocialFormComponent } from './Componentes/obra-social-form/obra-social-form.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegistroComponent,
    SelectorComponent,
    TurnoFormComponent,
    ListaTurnosComponent,
    PerfilComponent,
    CargarMedicoComponent,
    ListaMedicosComponent,
    ObraSocialFormComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule, // Añade HttpClientModule aquí
    RouterModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
