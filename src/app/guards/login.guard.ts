// src/app/guards/login.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { SharedService } from '../components/services/shared.service';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
      constructor(private auth: SharedService, private router: Router) { }

      canActivate(): boolean | UrlTree {
            if (this.auth.isLogedIn()) {
                  return this.router.createUrlTree(['/home/dashboard']);
            }
            return true;
      }
}
