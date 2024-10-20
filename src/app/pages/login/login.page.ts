import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  authServicio = inject(AuthService);
  spinnerServicio = inject(SpinnerService);
  router = inject(Router);
  isLoading: boolean = false;
  seleccionPerfil : string = '';

  formLogin = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$'),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(10),
    ]),
  });

  constructor() {}

  async iniciarSesion() {
    //loading.present();
    this.isLoading = true;

    if (this.formLogin.valid) {
      const { email, password } = this.formLogin.value;
      this.authServicio
        .signIn(email, password)
        .then((user) => {
          const usuario = user.user;
          this.authServicio
            .obtenerDocumento(`usuarios/${usuario.uid}`)
            .then((user: User) => {
              //Guardo localmente el usuario actual
              this.authServicio.guardarLocalStorage('usuario', user);
              this.isLoading = false;
              this.router.navigate(['tabs/menu']);
              this.formLogin.reset();

              //mensaje
              this.spinnerServicio.mostrarMensaje({
                message: `Bienvenido ${user.username}`,
                duration: 1500,
                color: 'success',
                position: 'middle',
                icon: 'person-circle-outline',
              });
            });
        })
        .catch((error) => {
          //mensaje
          this.spinnerServicio.mostrarMensaje({
            message: 'Uuups! Contraseña o usuario incorrecto.',
            duration: 2500,
            color: 'danger',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
          this.formLogin.reset();
        })
        .finally(() =>  this.isLoading = false);
    }
  }

  loginAutomatico(seleccionPerfil : string) {
    switch (seleccionPerfil) {
      case 'admin':
        this.formLogin.setValue({
          email: 'admin@gmail.com',
          password: 'admin1',
        });
        break;
      case 'invitado':
        this.formLogin.setValue({
          email: 'invitado@gmail.com',
          password: 'invitado',
        });
        break;
      case 'anonimo':
        this.formLogin.setValue({
          email: 'anonimo@gmail.com',
          password: 'anonimo1',
        });
        break;
    }
  }
}
