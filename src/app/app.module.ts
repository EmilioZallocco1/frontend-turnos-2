import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// components
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RegistroComponent } from './components/register/registro.component';
import { SelectorComponent } from './components/selector/selector.component';
import { TurnoFormComponent } from './components/shift-form/turno-form.component';
import { ListaTurnosComponent } from './components/list-shift/lista-turnos.component';
import { PerfilComponent } from './components/profile/perfil.component';
import { CargarMedicoComponent } from './components/load-doctor/cargar-medico.component';
import { ListaMedicosComponent } from './components/list-doctor/lista-medicos.component';
import { ObraSocialFormComponent } from './components/health-insurance-form/obra-social-form.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { LoaderComponent } from './components/loader/loader.component';
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
