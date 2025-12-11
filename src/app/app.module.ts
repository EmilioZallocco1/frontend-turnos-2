import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Componentes
import { LoginComponent } from './Componentes/login/login.component';
import { HomeComponent } from './Componentes/home/home.component';
import { RegistroComponent } from './Componentes/registro/registro.component';
import { SelectorComponent } from './Componentes/selector/selector.component';
import { TurnoFormComponent } from './Componentes/turno-form/turno-form.component';
import { ListaTurnosComponent } from './Componentes/lista-turnos/lista-turnos.component';
import { PerfilComponent } from './Componentes/perfil/perfil.component';
import { CargarMedicoComponent } from './Componentes/cargar-medico/cargar-medico.component';
import { ListaMedicosComponent } from './Componentes/lista-medicos/lista-medicos.component';
import { ObraSocialFormComponent } from './Componentes/obra-social-form/obra-social-form.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { LoaderComponent } from './Componentes/loader/loader.component';
import { LoadingInterceptor } from './Services/loading.interceptor';


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
    LoaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
