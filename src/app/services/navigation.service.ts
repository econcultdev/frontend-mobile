import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router) { }

  public toLogin() {
    this.router.navigate(['/login']);
  }

  public toHome() {
    this.router.navigate(['/app/homeapp']);
  }

  public toSearch() {
    this.router.navigate(['/app/search']);
  }
  public toMessages() {
    this.router.navigate(['/app/menssages']);
  }
  public toEventSaved() {
    this.router.navigate(['/app/saved']);
  }

  public toVerifyEmail() {
    this.router.navigate(['/verifyEmail']);
  }


  public toResetPassword(oobCode: string) {
    this.router.navigate(['/changePassword'], { queryParams: { oobCode } });
  }

  public toEmailVerified(oobCode: string) {
    this.router.navigate(['/emailVerified'], { queryParams: { oobCode } });
  }

  public toSettings(): void {
    this.router.navigate(['/settings']);
  }
}
