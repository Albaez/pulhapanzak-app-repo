import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  ToastController
} from '@ionic/angular/standalone';
import { CharacterDto } from 'src/app/auth/models/CharacterDto';
import { Userregister } from 'src/app/auth/models/Userregister';
import { AuthService } from '../../../auth/service/auth.service';
import { HomeServiceService } from './home-service/home-service.service';
 

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonCardTitle, IonCardContent, IonCard, IonAvatar, IonCardSubtitle, IonCardHeader, IonCard, IonItem, CommonModule,  IonThumbnail, IonIcon, IonLabel, IonList, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, IonFab, IonFabButton],
})
export class HomePage {
  private _authService: AuthService = inject(AuthService);
  private _router: Router = inject(Router);
  private _toastController: ToastController = inject(ToastController);
  private _homeService: HomeServiceService = inject(HomeServiceService);

  user: Userregister | null = null;
  usuarioLoggued: string = '';
  characters: CharacterDto[] = [];

  constructor() {}

  async showAlert(message: string, isError: boolean = false): Promise<void> {
    const toast = await this._toastController.create({
      message: message,
      duration: 2000,
      color: isError ? 'danger' : 'success',
    });
    toast.present();
  }

  async ngOnInit(): Promise<void> {
    await this.loadUser();
    this.loadCharacters();
  }

  private async loadUser(): Promise<void> {
    try {
      const user = await this._authService.getUserById();
      this.user = user;
      if (this.user) {
        this.usuarioLoggued = `${this.user.name} ${this.user.lastname}`;
      }
    } catch {
      await this.showAlert(
        'Ocurrió un error al intentar obtener datos de sesión (getUserById)',
        true
      );
    }
  }

  private async loadCharacters(): Promise<void> {
    try {
      const response = await fetch('https://rickandmortyapi.com/api/character');
      const data = await response.json();
      this.characters = data.results; 
    } catch (error) {
      this.showAlert('Error fetching characters', true);
    }
  }

  async logOut(): Promise<void> {
    await this._authService
      .signOut()
      .then(async () => {
        this._router.navigate(['/login']);
        await this.showAlert('Cierre de sesión exitosa');
      })
      .catch(async () => {
        await this.showAlert('Ha ocurrido un error', true);
      });
  }
}