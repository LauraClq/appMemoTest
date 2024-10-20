import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouteReuseStrategy } from '@angular/router';
import { filter, interval, Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-dificil',
  templateUrl: './dificil.page.html',
  styleUrls: ['./dificil.page.scss'],
})
export class DificilPage implements OnInit, OnDestroy {
  totalPairs: number = 10;
  images: string[] = [
    '../../assets/dificil/arandano.png',
    '../../assets/dificil/banana.png',
    '../../assets/dificil/cereza.png',
    '../../assets/dificil/durazno.png',
    '../../assets/dificil/frutilla.png',
    '../../assets/dificil/kiwi.png',
    '../../assets/dificil/naranja.png',
    '../../assets/dificil/palta.png',
    '../../assets/dificil/papaya.png',
    '../../assets/dificil/uva.png',
  ];

  cards: any[] = [];
  selectedCards: any[] = []; //cartas seleccionadas
  currentMove: number = 0; //Contador para el número de selecciones consecutivas del usuario.
  currentAttempts: number = 0; //Número total de intentos de selección del usuario.
  pairsFound: number = 0; //Pares encontrados
  public pregunta: string = 'assets/incognito.png';
  public active = true; //Bandera booleana para controlar el estado general del juego
  public selected: string[] = [];
  public selectedIndex: number[] = [];
  public seconds: number = 35;
  minutes: number = 0;
  segundosTranscurridos: number = 0;
  fechaFormateada: any;
  private subscription!: Subscription;
  public puntos = 0;
  public jugando = true;
  segTotales: number = 0;
  audio = new Audio();
  rutaAudio = '../../assets/sounds/dificil.mp3';
  audioGameOver = new Audio();
  rutaGameOver = '../../assets/sounds/game-over.mp3';
  audioWin = new Audio();
  rutaWin = '../../assets/sounds/win.mp3';
  usuario: User;

  constructor(
    private spinnerServicio: SpinnerService,
    private authService: AuthService,
    private router: Router
  ) {
    this.audio.src = this.rutaAudio;
    this.audio.volume = 1;
    this.audio.loop = true;

    this.audioGameOver.src = this.rutaGameOver;
    this.audioWin.src = this.rutaWin;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.pauseMusic();
    this.audioGameOver.pause();
    this.audioGameOver.currentTime = 0;
  }

  ngOnInit() {
    //genero las cartas aleatorio
    this.playMusic();
    this.generateCards();
    this.subscription = interval(1000).subscribe(() => {
      this.seconds--;
      this.segundosTranscurridos++;
      if (this.seconds <= 0) {
        this.endGame();
      }
    });
  }

  generateCards(): void {
    let selectedImages = this.images
      .slice(0, this.totalPairs)
      .concat(this.images.slice(0, this.totalPairs)); // Duplica las imágenes
    selectedImages.sort(() => Math.random() - 0.5); // Mezcla las imágenes

    for (let i = 0; i < this.totalPairs * 2; i++) {
      this.cards.push({ id: i, image: selectedImages[i], active: false });
    }
  }

  activate(card: any): void {
    if (this.currentMove < 2 && !card.active) {
      card.active = true;
      this.selectedCards.push(card); //guardo la imagenes seleccionadas

      if (++this.currentMove === 2) {
        this.currentAttempts++;
        if (this.selectedCards[0].image === this.selectedCards[1].image) {
          //si se UN par
          this.pairsFound++;
          this.active = true;
          this.selectedCards = [];
          this.currentMove = 0;
          this.puntos += 10;
          if (this.pairsFound === this.totalPairs) {
            //Si se encuentran TODOS los pares:
            console.log('¡Has ganado!');
            this.pauseMusic();
            this.segTotales = this.minutes * 60 + this.segundosTranscurridos;
            this.fechaFormateada = this.formatearFecha(new Date());
            //guardar en firebsae
            this.usuario = this.authService.obtenerLocalStorage('usuario');
            console.log('Usuario actual', this.usuario);
            this.authService.guardarDatosJugador(
              this.usuario.username,
              this.segTotales,
              this.fechaFormateada,
              'dificil',
              'jugadores'
            );
            setTimeout(() => {
              if (this.subscription) {
                this.jugando = false;
                this.subscription.unsubscribe();
              }
            }, 1500);
            this.playAudioForDuration(this.audioWin, 1500);
            this.spinnerServicio.mostrarMensaje({
              message: `¡¡GANASTE!!`,
              duration: 1500,
              color: 'warning',
              position: 'middle',
            });
            console.log('piuntoss', this.puntos);
            console.log('segTotales', this.segTotales);
            console.log('Fecha', this.fechaFormateada);
          }
        } else {
          setTimeout(() => {
            this.selectedCards.forEach((c) => (c.active = false));
            this.selectedCards = [];
            this.currentMove = 0;
          }, 1500);
        }
      }
    }
  }

  endGame() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.pauseMusic();

    this.jugando = false;
    this.segTotales = this.minutes * 60 + this.segundosTranscurridos;
    this.fechaFormateada = this.formatearFecha(new Date());
    this.spinnerServicio.mostrarMensaje({
      message: `¡¡Se acabó el tiempo Perdiste!!`,
      duration: 1500,
      color: 'danger',
      position: 'middle',
    });
    this.playAudioForDuration(this.audioGameOver, 1000);
  }

  reset() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.playMusic();
    this.selectedCards = [];
    this.cards = [];
    this.generateCards();
    this.pairsFound = 0;
    this.seconds = 35;
    this.jugando = true;
    this.puntos = 0;
    this.segTotales = 0;
    this.segundosTranscurridos = 0;

    this.subscription = interval(1000).subscribe(() => {
      this.seconds--;
      this.segundosTranscurridos++;
      if (this.seconds <= 0) {
        this.endGame();
      }
    });
  }

  private formatearFecha(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  }

  playAudioForDuration(audio: any, duration: number) {
    audio.play().then(() => {
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, duration);
    });
  }

  playMusic() {
    this.audio.play(); // Reproduce la música
  }

  pauseMusic() {
    if (this.audio) {
      this.audio.pause(); // Pausa la música
      this.audio.currentTime = 0; // Reinicia la posición de reproducción
    }
  }
}
