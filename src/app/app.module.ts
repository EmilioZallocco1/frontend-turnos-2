import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http'; // Importa HttpClientModule
<<<<<<< Updated upstream
import { RouterModule } from '@angular/router';
import { RegistroComponent } from './registro/registro.component';
import { SelectorComponent } from './selector/selector.component';
import { TurnoFormComponent } from './turno-form/turno-form.component';
import { ListaTurnosComponent } from './lista-turnos/lista-turnos.component';
import { PerfilComponent } from './perfil/perfil.component';
import { CargarMedicoComponent } from './cargar-medico/cargar-medico.component';
import { ListaMedicosComponent } from './lista-medicos/lista-medicos.component';
=======
import { RegistroComponent } from './Componentes/registro/registro.component';
import { SelectorComponent } from './Componentes/selector/selector.component';
import { TurnoFormComponent } from './Componentes/turno-form/turno-form.component';
import { ListaTurnosComponent } from './Componentes/lista-turnos/lista-turnos.component';
import { PerfilComponent } from './Componentes/perfil/perfil.component';
import { CargarMedicoComponent } from './Componentes/cargar-medico/cargar-medico.component';
import { ListaMedicosComponent } from './Componentes/lista-medicos/lista-medicos.component';
import { ObraSocialFormComponent } from './Componentes/obra-social-form/obra-social-form.component';
>>>>>>> Stashed changes



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
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule, // Añade HttpClientModule aquí
    
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
