import { Injectable } from '@angular/core';
import {
      CanActivate,
      CanActivateChild,
      Router,
      ActivatedRouteSnapshot,
      RouterStateSnapshot,
      UrlTree
} from '@angular/router';
import { SharedService } from '../components/services/shared.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
      constructor(private auth: SharedService, private router: Router) { }

      private check(): boolean | UrlTree {
            if (this.auth.isLogedIn()) {
                  return true;
            }
            return this.router.createUrlTree(['/']);
      }

      canActivate(
            route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot
      ): boolean | UrlTree {
            return this.check();
      }

      canActivateChild(
            childRoute: ActivatedRouteSnapshot,
            state: RouterStateSnapshot
      ): boolean | UrlTree {
            return this.check();
      }
}
