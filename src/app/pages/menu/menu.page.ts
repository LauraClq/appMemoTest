import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage  {

  authService = inject(AuthService);
  router = inject(Router);
  spinnerService = inject(SpinnerService);

  async cerrarSesion() {
    const resultado = await this.authService.cerrarSesion();
    if (resultado) {
      this.router.navigate(['/login']);
    } else {
      //mensaje
      this.spinnerService.mostrarMensaje({
        message: 'Uuuup! Ocurrio un error en cerrar la sesión.',
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    }
  }
}
