import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service'; // Servicio de autenticación
import { ObraSocialService } from 'src/app/Services/health-insurance.service'; // Servicio de obra social
import { ActivatedRoute,Router } from '@angular/router';
import { ObraSocialResponse } from '../../models/health-insurance.interface'; // Importa la interfaz


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent implements OnInit {
  registroForm: FormGroup;
  obrasSociales: any[] = []; // Para almacenar las obras sociales
  errorMessage: string = '';
  successMessage: string = '';

  //  para saber si estoy en modo admin
 modoAdmin: boolean = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private obraSocialService: ObraSocialService,
    private router: Router,
     private route: ActivatedRoute
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      email: ['',[Validators.required,Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),],],
       password: ['',[Validators.required,Validators.minLength(8),Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/),],],
      obraSocialId: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.loadObrasSociales(); // Cargar las obras sociales al inicializar el componente
    this.modoAdmin = this.route.snapshot.data['modoAdmin'] === true;


   this.loadObrasSociales();

  }

loadObrasSociales() {
  this.obraSocialService.getObrasSociales().subscribe({
    next: (response: ObraSocialResponse) => {
      if (response.data && Array.isArray(response.data)) {
        this.obrasSociales = response.data;
        console.log('Obras sociales:', this.obrasSociales); 
      } else {
        this.errorMessage = 'No se encontraron obras sociales.';
      }
    },

    error: (error) => {
      console.error('Error al cargar obras sociales', error);
      this.errorMessage = 'No se pudieron cargar las obras sociales.';
    }
  });
}


  onSubmit() {
    if (this.registroForm.valid) {
      const { nombre, apellido, email, password, obraSocialId } =
        this.registroForm.value;
        if (!this.registroForm.valid) {
     this.registroForm.markAllAsTouched();
     if (this.registroForm.get('email')?.invalid) {
       this.errorMessage ='El email no tiene un formato válido. Debe ser algo como ejemplo@mail.com';
     } else {
       this.errorMessage = 'Por favor, complete todos los campos requeridos.';
     }
     return;
   }
  }


   const { nombre, apellido, email, password, obraSocialId } =
     this.registroForm.value;


      this.authService
        .register(nombre, apellido, email, password, obraSocialId)
        .subscribe(
          (response) => {
            console.log('Registro exitoso:', response);
            this.successMessage = 'Registro exitoso. Por favor, inicie sesión.';
            this.registroForm.reset();
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          },
          (error) => {
            console.error('Error en el registro:', error);
            this.errorMessage = error;
          }
        );
         //  elegimos observable según si es admin o no
   let request$;


   if (this.modoAdmin) {
     //  Alta hecha desde el panel admin → crea rol ADMIN
     request$ = this.authService.registerByAdmin(
       nombre,
       apellido,
       email,
       password,
       obraSocialId,
       'admin'
     );

    } else {
      console.log('Formulario inválido');
      this.errorMessage = 'Por favor, complete todos los campos requeridos.';
      // 👤 Registro común de paciente
     request$ = this.authService.register(
       nombre,
       apellido,
       email,
       password,
       obraSocialId
     );

    }
     request$.subscribe({
     next: (response) => {
       console.log('Registro exitoso:', response);
       this.registroForm.reset();
       this.errorMessage = '';


       if (this.modoAdmin) {
         this.successMessage =
           'Usuario administrador registrado correctamente.';
         setTimeout(() => this.router.navigate(['/home']), 1500);
       } else {
         this.successMessage = 'Registro exitoso. Por favor, inicie sesión.';
         setTimeout(() => this.router.navigate(['/login']), 2000);
       }
     },
     error: (error) => {
       console.error('Error en el registro:', error);
       this.errorMessage =
         error?.error?.message || 'Ocurrió un error al registrar.';
       this.successMessage = '';
     },
   });

  }
  
}
