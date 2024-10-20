import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { SpinnerService } from '../services/spinner.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage {

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
