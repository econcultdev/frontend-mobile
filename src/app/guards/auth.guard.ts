import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private utilService: UtilsService, 
    ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean |
    UrlTree> | Promise<boolean | UrlTree> {
    let userAuthenticated = true;
    if (!sessionStorage.getItem('showSlides')) {
      this.utilService.slidesShow = true;
    }
    if (!sessionStorage.getItem('token') || !sessionStorage.getItem('userId') || !sessionStorage.getItem('userName')) {
      userAuthenticated = false;
    } else {
      this.authService.checkToken({})
        .subscribe((res) => {
          if (!res.username) {
            userAuthenticated = false;
          }
        }, (err) => {
          userAuthenticated = false;
          console.error(err);
        })
    }

    if (userAuthenticated) {
      return true;
    } else {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('userName');
      sessionStorage.removeItem('name');
      sessionStorage.removeItem('sexo');
      console.log('auth guard failed. No token. Redirect to login.');
      this.router.navigate(['/login'], {
        queryParams: {
          return: state.url
        }
      });
      return false;
    }
  }
}
