import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.page.html',
  styleUrls: ['./activate.page.scss'],
})
export class ActivatePage implements OnInit {

  username = '';
  token = '';
  linkBack = false;
  linkRegenerate = false;

  constructor(public router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private utilsService: UtilsService) { }


  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.username = params['params']['username'];
      if (this.username != undefined) {
        this.username = params['params']['username'].replace(' ', '+');
        this.token = params['params']['token'];
        if (!this.username || !this.token) {
          this.utilsService.presentToastLanguage('ACTIVATION_TS.PARAMETERS_ERROR');
        } else {
          this.utilsService.presentLoadingWithOptions().then(() => {
            this.authService.activate({ username: this.username, token: this.token })
              .subscribe((res) => {
                this.utilsService.dismiss().then(() => {
                  if (res.error !== undefined) {
                    res = res.error;
                  }
                  this.showMsg(res);
                });
              }, (err) => {
                console.error(err);
                this.utilsService.presentToastLanguage('ACTIVATION_TS.SERVER_ERROR');
                this.utilsService.dismiss();
              });
          });
        }
      } else {
        this.utilsService.presentToastLanguage('ACTIVATION_TS.USER_EMPTY');
        this.utilsService.dismiss();
        this.username = '';
      }
    });
  }

  ionViewWillLeave() {
    return this.utilsService.dismiss();
  }

  activar() {
    this.utilsService.presentLoadingWithOptions().then(() => {
      this.authService.activate({ username: this.username, regenerate: false, token: this.token }).subscribe((res) => {
        this.utilsService.dismiss().then(() => {
          this.linkRegenerate = false;
          this.showMsg(res);
        });
      }, (err) => {
        console.error(err);
        this.utilsService.presentToastLanguage('ACTIVATION_TS.SERVER_ERROR');
        this.utilsService.dismiss();
      });
    });
  }

  regenerate() {
    this.utilsService.presentLoadingWithOptions().then(() => {
      this.authService.activate({ username: this.username, regenerate: true, token: this.token }).subscribe((res) => {
        this.utilsService.dismiss().then(() => {
          this.linkRegenerate = false;
          this.showMsg(res);
        });
      }, (err) => {
        console.error(err);
        this.utilsService.presentToastLanguage('ACTIVATION_TS.SERVER_ERROR');
        this.utilsService.dismiss();
      });
    });
  }

  goAuth() {
    this.router.navigate(['login']);
  }

  /**
   *
   * @param res
   */
  showMsg(res: any) {
    switch (res.code) {
      case 0:
        sessionStorage.setItem('userName', res.user.username);
        sessionStorage.setItem('userId', res.user.id);
        sessionStorage.setItem('token', res.token);
        this.router.navigate(['homeapp']);
        break;
      case 3:
        this.utilsService.presentToastLanguage('ACTIVATION_TS.USER_NOT_FOUND', { username: this.username });
        break;
      case 4:
        this.utilsService.presentToastLanguage('ACTIVATION_TS.TOKEN_NOT_FOUND', { username: this.username, email: res.email });
        break;
      case 5:
        this.utilsService.presentToastLanguage('ACTIVATION_TS.EMAIL_NOT_SENT', { email: res.email });
        break;
      case 6:
        this.utilsService.presentToastLanguage('ACTIVATION_TS.TOKEN_NOT_UPDATED');
        break;
      case 7:
        this.utilsService.presentToastLanguage('ACTIVATION_TS.USER_NOT_ACTIVATED');
        break;
      case 8:
        this.linkRegenerate = true;
        this.utilsService.presentToastLanguage('ACTIVATION_TS.TOKEN_EXPIRED', { tokenTime: res.tokenTime });
        break;
      case 9:
        this.utilsService.presentToastLanguage('ACTIVATION_TS.NEW_TOKEN');
        break;
      default:
        if (res.msg) {
          this.utilsService.presentToast(res.msg, 3000, '-danger');
        } else {
          this.utilsService.presentToastLanguage('ACTIVATION_TS.SERVER_ERROR');
        }
        break;
    }
  }

}
