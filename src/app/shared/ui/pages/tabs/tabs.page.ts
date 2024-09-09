import { Component } from '@angular/core';
import {
  IonHeader,
  IonIcon,
  IonLabel,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  imageOutline,
  personOutline,
} from 'ionicons/icons';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs, IonHeader]
})
export class TabsPage {

  constructor() { 
      addIcons({
        homeOutline,
        imageOutline,
        personOutline,
      });
    }
}
