import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth-guard';

export const routes: Routes = [

  {
    path: 'login',
    loadComponent: () => import('./auth/pages/login-page/login-page.page').then( m => m.LoginPagePage)
  },

  {
    path: 'register',
    loadComponent: () => import('../app/auth/pages/register-page/register-page.page').then( m => m.RegisterPagePage)
  },

  {
    path: '',
    loadChildren: () => import('./shared/ui/pages/tabs/tabs.route').then((m) => m.routes),
    canActivate: [() => inject(AuthGuard).canActivate()],
  },
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full',
  },
  {
    path: 'password.reset',
    loadComponent: () => import('./auth/pages/password.reset/password.reset.page').then( m => m.PasswordResetPage)
  },


];
