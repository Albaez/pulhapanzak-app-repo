import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/service/auth.service';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  private _authService: AuthService = inject(AuthService);
  private _router: Router = inject(Router);

  async canActivate(): Promise<boolean> {
    const isUserLoggued: boolean = await this._authService.isUserLoggued();
    if (!isUserLoggued) {
      this._router.navigate(['/login']);
    }
    return isUserLoggued;
  }
}