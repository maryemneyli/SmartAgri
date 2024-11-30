import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SAdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.authService.getToken();
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      console.log(tokenPayload)
      if (tokenPayload.role === 'superadmin') {
        return true;
      }
    }
    return false;
  }
}
