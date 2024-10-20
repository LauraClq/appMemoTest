import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
})
export class RankingPage implements OnInit{
  jugadores: any[] = [];
  selectedMode: string = 'facil';
  firebaseSvc = inject(AuthService);
  seleccionNivel: string = 'facil';
  jugadoresFacil: any[] = [];
  topFacil: any[] = [];
  topDif: any[] = [];
  topMed: any[] = [];
  jugadoresMedio: any[] = [];
  jugadoresDificil: any[] = [];
  loadingF = false;

  ngOnInit(): void {
    this.mostrarNivel(this.seleccionNivel);
  }

  filtrarJugadoresFacil(modo: string) {
    this.firebaseSvc
      .getJugadoresPorNivel(modo)
      .subscribe((jugadores: any[]) => {
        this.jugadoresFacil = jugadores.map((jug: any) => ({
          ...jug,
          fechaForm: jug.fecha,
          tiempoForm: jug.tiempo,
        }));
        this.jugadoresFacil.sort((a, b) => a.tiempo - b.tiempo);
        this.topFacil = this.jugadoresFacil.slice(0, 5);
        this.loadingF = false;
        // this.jugadores = jugadores;
        console.log(this.jugadoresFacil);
        // return jugadores;
      });
  }

  mostrarNivel(seleccionNivel: string){
    switch (seleccionNivel) {
      case 'facil':
        this.loadingF = true;
        this.filtrarJugadoresFacil(seleccionNivel);
        break;
      case 'medio':
        this.filtrarJugadoresFacil(seleccionNivel);
        break;
      case 'dificil':
        this.filtrarJugadoresFacil(seleccionNivel);
      break;
    }
  }
}
