import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonHeader,
  IonIcon,
  IonNote,
  IonRow,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { GalleryService } from '../auth/service/service-gallery/gallery.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
  standalone: true,
  imports: [
    IonToolbar,
    IonHeader,
    IonTitle,
    IonContent,
    IonButton,
    IonNote,
    IonGrid,
    IonCardHeader,
    IonRow,
    IonCard,
    IonCol,
    IonCardTitle,
    IonCardContent,
    CommonModule,
    IonFab,
    IonFabButton,
    IonIcon
  ],
})
export class GalleryPage implements OnInit {
  private _GalleryService: GalleryService = inject(GalleryService);
  private _router: Router = inject(Router);
  private _toastController: ToastController = inject(ToastController);

  galleryIt: any[] | null = [];

  constructor() {
    addIcons({add})
  }

  async ngOnInit(): Promise <void> {

    try{

      const gallery = await this._GalleryService.getGalleryByQuery();
      this.galleryIt = gallery; 
      console.log('galleryByQuery => ', gallery);
    } catch (error) {
      console.log('error => ', error);
      await this.showAlert(
        'ocurrió un error al intentar obtener datos de galería (getGalleryByQuery)',
        true
      );
    }
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
