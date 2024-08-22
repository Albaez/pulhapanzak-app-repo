import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { RegisterPagePage } from '../register-page/register-page.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, NgClass, FormsModule, IonToolbar, IonTitle, IonContent, IonLabel, IonButton, IonInput, IonItem, RegisterPagePage],
})
export class HomePage {



  constructor() {

  }
}
