import { Routes } from '@angular/router';


export const routes: Routes = [

  {
    path: 'login',
    loadComponent: () => import('./login-page/login-page.page').then( m => m.LoginPagePage)
  },

  {
    path: 'register',
    loadComponent: () => import('./register-page/register-page.page').then( m => m.RegisterPagePage)
  },


  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
