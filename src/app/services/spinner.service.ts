import { inject, Injectable } from '@angular/core';
import {
  LoadingController,
  ToastController,
  ToastOptions,
} from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  spinner = inject(LoadingController);
  spinnerMensaje = inject(ToastController);
  constructor() {}

  loading() {
    return this.spinner.create({ spinner: 'circular' });
  }

  //Generar mensaje
  async mostrarMensaje(opts: ToastOptions) {
    const toast = await this.spinnerMensaje.create(opts);
    toast.present();
  }
}
