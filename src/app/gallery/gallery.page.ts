import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  IonImg,
  IonNote,
  IonRow,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

import { GalleryData } from '../auth/models/GalleryData';
import { GalleryService } from './service-gallery/gallery.service';
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
    IonImg,
    IonFabButton,
    IonIcon
  ],
})
export class GalleryPage implements OnInit {
 
  constructor(private galleryService: GalleryService) { }
  galleries: GalleryData[] = [];
  photos: string[] = []

  ngOnInit() {
    this.galleryService.getActiveGalleries().subscribe((data) => {
      this.galleries = data;
      this.photos = data.map((gallery) => gallery.photo)
      console.log(this.photos);

    })
  }
}
