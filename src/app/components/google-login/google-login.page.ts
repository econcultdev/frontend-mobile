import { Component, OnInit, Input } from '@angular/core';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../services/auth.service';
import { UtilsService } from '../../services/utils.service';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

import { myInitObject } from '../../config/config';

@Component({
  selector: 'app-google-login',
  templateUrl: './google-login.page.html',
  styleUrls: ['./google-login.page.scss'],
})
export class GoogleLoginPage implements OnInit {

  user: Observable<firebase.User>;
  loaded = false;
  _return = '/app';

  @Input()
  set returnStr(ret: string) {
    this._return = (ret && ret.trim());
  }

  get returnStr(): string { return this._return; }

  constructor(private afAuth: AngularFireAuth,
    private gplus: GooglePlus,
    private router: Router,
    private authService: AuthService,
    private platform: Platform,
    private utilsService: UtilsService) {
    this.user = this.afAuth.authState;
  }

  ngOnInit() {
    this.gplus.login({}).then(res => console.log(res)).catch(err => console.error(err));
  }

  
  async login(credential: firebase.auth.UserCredential) {
    try {
      const token = (<any>credential).credential.idToken;
      if (credential.user && credential.user.email && credential.user.emailVerified && token) {
        let _this = this;
        return new Promise(function (resolve, reject) {
          _this.authService.getGoogleUser(credential.user.email, token, credential.user.displayName).subscribe((res) => {
            if (res && !res.status) {
              switch (res.code) {
                case 0:
                  if (res.token) {
                    sessionStorage.setItem('name', (credential.user.displayName !== '') ? credential.user.displayName.split(/ +/)[0]
                      : credential.user.email);
                    sessionStorage.setItem('userName', credential.user.email);
                    sessionStorage.setItem('userId', res.userId);
                    sessionStorage.setItem('token', res.token);
                    sessionStorage.setItem('imagen', res.imagen);
                    if (res.register) {
                      sessionStorage.setItem('register', '1');
                    }
                  }
                  break;
                case 1:
                  _this.utilsService.presentToastLanguage('GOOGLE_LOGIN_TS.USER_NOT_EXIST');
                  break;
                case 2:
                  _this.utilsService.presentToastLanguage('GOOGLE_LOGIN_TS.PASSWORD_WRONG');
                  break;
                case 3:
                  _this.utilsService.presentToastLanguage('GOOGLE_LOGIN_TS.TOKEN_ERROR');
                  break;
                case 4:
                  _this.utilsService.presentToastLanguage('GOOGLE_LOGIN_TS.USER_NOT_ACCEPTED_PRIVACY_CONDITIONS');
                  break;
                case 5:
                  _this.utilsService.presentToastLanguage('GOOGLE_LOGIN_TS.USER_NOT_ACTIVE');
                  break;
                case 6:
                  _this.utilsService.presentToastLanguage('GOOGLE_LOGIN_TS.USER_EXIST_ERROR');
                  break;
                case 7:
                  _this.utilsService.presentToastLanguage('GOOGLE_LOGIN_TS.USER_PROVIDE');
                  break;
                default:
                  if (res.msg) {
                    _this.utilsService.presentToast(res.msg, 3000, '-danger');
                  } else {
                    _this.utilsService.presentToastLanguage('GOOGLE_LOGIN_TS.SERVER_ERROR');
                  }
                  break;
              }
              resolve(res);
            } else {
              _this.utilsService.presentToastLanguage('GOOGLE_LOGIN_TS.USER_NOT_VALID');
              resolve(null);
            }
          }, (err) => {
            _this.utilsService.presentToastLanguage('GOOGLE_LOGIN_TS.SERVER_ERROR');
            reject(err);
          });
        });
      } else {
        this.utilsService.presentToastLanguage('GOOGLE_LOGIN_TS.USER_NOT_VALID');
        return null;
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  async nativeGoogleLogin(): Promise<firebase.auth.UserCredential> {
    try {

      const gplusUser = await this.gplus.login({
        'webClientId': myInitObject.webClientId,
        'offline': true,
        'scopes': 'profile email'
      });
      return await this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken));
    } catch (err) {
      throw new Error(err);
    }
  }

  async webGoogleLogin(): Promise<firebase.auth.UserCredential> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      return await this.afAuth.auth.signInWithPopup(provider);
    } catch (err) {
      throw new Error(err);
    }
  }

  googleLogin() {
    this.utilsService.presentLoadingWithOptions().then(() => {
      if (this.platform.is('cordova') && (<any>window).cordova) {
        console.log('cordova');
        return this.nativeGoogleLogin();
      } else {
        console.log('web');
        return this.webGoogleLogin();
      }
    }).then((credential) => {
      return this.login(credential);
    }).then((res: any) => {
      this.dismiss().then(() => {
        if (res && !res.status && res.code === 0) {
          this.router.navigateByUrl(this._return, { skipLocationChange: false });
        }
      });
    }).catch((err) => {
      this.dismiss();
      console.error(err);
      this.utilsService.presentToastLanguage('GOOGLE_LOGIN_TS.GOOGLE_VALIDATION_ERROR');
    });
  }

  signOut() {
    this.afAuth.auth.signOut();
  }

  dismiss() {
    this.loaded = true;
    return this.utilsService.dismiss();
  }

}
