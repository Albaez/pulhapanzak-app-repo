import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { AuthService } from '../../../auth/service/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, IonHeader, IonTitle, IonToolbar, IonFab, IonFabButton],
})
export class HomePage {
  private _authService: AuthService = inject(AuthService);
  private _router: Router = inject(Router);
  private _toastController: ToastController = inject(ToastController);





  async logOut(): Promise<void> {
    await this._authService
      .signOut()
      .then(async () => {
        this._router.navigate(['/login']);
        await this.showAlert(
          'Cierre de sesión exitosa'
        );
      })
      .catch(async () => {
        await this.showAlert('Ha ocurrido un error', true);
      });
  }

  async showAlert(message: string, isError: boolean = false): Promise<void> {
    const toast = await this._toastController.create({
      message: message,
      duration: 1000,
      color: isError ? 'danger' : 'success',
    });
    toast.present();
  }
}



