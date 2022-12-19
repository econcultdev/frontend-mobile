import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UtilsService } from '../../services/utils.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { myInitObject } from '../../config/config';
import { Subscription } from 'rxjs';
import { AlertController, Platform } from '@ionic/angular';
import { TranslateConfigService } from 'src/app/services/translate-config.service';
import { GoogleLoginService } from 'src/app/services/google-login.service';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toast.service';
import { AuthConstants } from 'src/app/config/auth-constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {

  //public user:User = new User();
  showGoogleLoginButton = false;
  showFacebookLoginButton = false;
  loginForm: FormGroup;
  username = '';
  password = '';
  secret = atob(myInitObject.secretPassword);
  remember = null;
  return = '';
  loaded = false;
  dataPrivacyText: { name: '', name_multi: [], text: '', text_multi: [], agree?: '', not_agree?: '' };
  legalConditionsText: { name: '', name_multi: [], text: '', text_multi: [], agree?: '', not_agree?: '' };
  slideOpts = {
    initialSlide: 0,
    speed: 700,
    autoplay: true,
    loop: true,
    slidesPerView: 4,
    spaceBetween: 20,
    breakpoints: {
      480: {
        slidesPerView: 2,
        spaceBetween: 10
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      840: {
        slidesPerView: 3,
        spaceBetween: 20
      },
      1080: {
        slidesPerView: 4,
        spaceBetween: 20
      }
    }
  };
  showPassword = false;
  isKeyboardHide = true;

  private _language;
  private _translateServiceSubscription: Subscription;
  private _hideKeyboardSubscription: Subscription;
  private _showKeyboardSubscription: Subscription;

  constructor(
    private platform: Platform,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private utilsService: UtilsService,
    public alertController: AlertController,
    private translateConfigService: TranslateConfigService,
    private googleLoginService: GoogleLoginService,
    private keyboard: Keyboard,
    private storageService: StorageService,
    private toastService: ToastService
  ) {
    if (this.platform.is('desktop') || this.platform.is('android')) {
      this.showGoogleLoginButton = true;
    } else {
      this.showGoogleLoginButton = false;
    }
  }

  ngOnInit() {
    this._translateServiceSubscription = this.translateConfigService.language.subscribe(language => {
      this._language = language;
      this.updateValuesTextVariable('dataPrivacyText');
      this.updateValuesTextVariable('legalConditionsText');
    });
  }

  /**
   * It is used to update the legal text depending on the language
   * @param variable Name of text legal variable
   */
  updateValuesTextVariable(variable: string) {
    if (this[variable] && this[variable].name_multi) {
      let lNameMulti: any = this[variable].name_multi[this._language];
      let lTextMulti: any = this[variable].text_multi[this._language];
      lNameMulti = lNameMulti ? lNameMulti : this[variable].name;
      lTextMulti = lTextMulti ? lTextMulti : this[variable].text;
      this[variable].name = lNameMulti;
      this[variable].text = lTextMulti;
      this.setTranslationValue('LOGIN_TS.AGREE', variable);
      this.setTranslationValue('LOGIN_TS.NOT_AGREE', variable);
    }
  }

  /**
   * Used to update the agree and no agree buttons depending on the language
   * @param translation Language
   * @param variable Name of text legal variable
   */
  setTranslationValue(translation: string, variable: any) {
    this.utilsService.translateLanguage(translation).subscribe(res => {
      if (res && res != null) {
        if (translation.toLowerCase().includes('not_agree')) {
          this[variable].not_agree = res;
        } else {
          this[variable].agree = res;
        }
      }
    });
  }

  ionViewWillEnter() {
    this._showKeyboardSubscription = this.keyboard.onKeyboardWillShow().subscribe(() => {
      this.isKeyboardHide = false;
    });

    this._hideKeyboardSubscription = this.keyboard.onKeyboardWillHide().subscribe(() => {
      this.isKeyboardHide = true;
    });
    this.loaded = false;
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('sexo');
    sessionStorage.removeItem('imagen');
    //this.route.queryParams.subscribe(params => { this.return = params['return'] || '/app' });
    if (!sessionStorage.getItem('logout') && localStorage.getItem('remember') === '1' && localStorage.getItem('userName') && localStorage.getItem('password')) {
      sessionStorage.removeItem('logout');
      this.remember = '1';
      this.username = localStorage.getItem('userName');
      this.password = CryptoJS.AES.decrypt(localStorage.getItem('password'), this.secret).toString(CryptoJS.enc.Utf8);
      this.signin({ remember: true, username: this.username, password: this.password });
    } else {
      this.loaded = true;
    }
    sessionStorage.removeItem('logout');
    this.loginForm = this.formBuilder.group({
      username: [this.username, [Validators.required, Validators.minLength(1)]],
      password: [this.password, [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      remember: [this.remember]
    });
    this.getLegalText();
  }

  /**
   * Get legal text
   */
  getLegalText() {
    this.authService.textoLegalList().subscribe(data => {
      this.setLegalTextToVariable(data, 'data privacy', 'dataPrivacyText');
      this.setLegalTextToVariable(data, 'legal conditions', 'legalConditionsText');
    }, (err) => {
      this.dismiss();
      console.error(err);
      this.utilsService.presentToastLanguage('LOGIN_TS.SERVER_ERROR');
    });
  }

  /**
   * Sets the values ​​based on the language of the variable based on the title of the legal text
   * @param data Data
   * @param privacyTitle Name of text legal title
   * @param variable Name of text legal variable
   */
  setLegalTextToVariable(data: any[], privacyTitle: string, variable: any) {
    let lText = data.find(text => text.TypeLegalText.name.en.toLowerCase().includes(privacyTitle));
    if (lText) {
      let lNameMulti: any = lText[this._language];
      let lTextMulti: any = lText.texto_multi[this._language];
      lNameMulti = lNameMulti ? lNameMulti : lText.nombre;
      lTextMulti = lTextMulti ? lTextMulti : lText.texto;
      this[variable] = {
        name: lNameMulti,
        name_multi: lText.nombre_multi,
        text: lTextMulti.replace(/\n/g, '<br />'),
        text_multi: lText.texto_multi
      };
      this.setTranslationValue('LOGIN_TS.AGREE', variable);
      this.setTranslationValue('LOGIN_TS.NOT_AGREE', variable);
    }

  }

  ionViewWillLeave() {
    return this.utilsService.dismiss();
  }

  onFormSubmit(form: any) {
    if (form.remember) {
      localStorage.setItem('remember', '1');
    } else {
      localStorage.removeItem('remember');
    }
    this.signin(form);
  }

  private signin(form: any) {
  this.authService.login(form)
      .subscribe(res => {
        this.loaded = res.code === 0 ? false : true;
        switch (res.code) {
          case 0:
            if (res.token) {
              if (form.remember) {
                localStorage.setItem('password', CryptoJS.AES.encrypt(form.password, this.secret).toString());
                localStorage.setItem('userName', form.username);
              }
              sessionStorage.setItem('name', res.name);
              sessionStorage.setItem('userName', form.username);
              sessionStorage.setItem('userId', res.userId);
              sessionStorage.setItem('token', res.token);
              sessionStorage.setItem('sexo', res.sexo);
              sessionStorage.setItem('imagen', res.imagen);
              if (!res.cultoTipo) {
                if (!sessionStorage.getItem('register')) {
                  this.dismiss();
                  return this.router.navigate(['/'])
                } else {
                  this.dismiss();
                  sessionStorage.removeItem('register');
                }
              }
              else
              {
                return this.router.navigate(['/'])
              }
            }
            break;
          case 1:
            this.utilsService.presentToastLanguage('LOGIN_TS.USER_NO_EXIST');
            break;
          case 2:
            this.utilsService.presentToastLanguage('LOGIN_TS.PASSWORD_ERROR');
            break;
          case 3:
            this.utilsService.presentToastLanguage('LOGIN_TS.TOKEN_CHECK_ERROR');
            break;
          case 4:
            this.utilsService.presentToastLanguage('LOGIN_TS.USER_NOT_ACCEPTED_PRIVACY_CONDITIONS');
            break;
          case 5:
            this.utilsService.presentToastLanguage('LOGIN_TS.USER_NOT_ACTIVE');
            break;
          case 6:
            this.utilsService.presentToastLanguage('LOGIN_TS.USER_NOT_EXIST');
            break;
          case 7:
            this.utilsService.presentToastLanguage('LOGIN_TS.USER_NOT_SUPPLIED');
            break;
          default:
            if (res.msg) {
              this.utilsService.presentToast(res.msg, 3000, '-danger');
            } else {
              this.utilsService.presentToastLanguage('LOGIN_TS.SERVER_ERROR');
            }
            break;
        }
      }, (err) => {
        console.error(err);
        this.utilsService.presentToastLanguage('LOGIN_TS.SERVER_ERROR');
        this.dismiss();
      });
      
  }

  private signinAAAA(form: any) {
    /*
    if (this.return === 'homeapp') {
      this.utilsService.presentLoadingWithOptions();
    }*/

    /*
    this.authService.useLogin(this.loginForm)
    .subscribe(value => {
      if(value){
        this.router.navigateByUrl('/dashboard')
      }
      else{
        alert('login fails')
      }
    },error => {
      console.log(error)
      alert('login fails')
    })*/

    this.authService.login(form)
      .subscribe(res => {
        this.dismiss().then(() => {
          if (res.error !== undefined) {
            res = res.error;
          }
          this.loaded = res.code === 0 ? false : true;
          switch (res.code) {
            case 0:
              if (res.token) {
                if (form.remember) {
                  localStorage.setItem('password', CryptoJS.AES.encrypt(form.password, this.secret).toString());
                  localStorage.setItem('userName', form.username);
                }
                sessionStorage.setItem('name', res.name);
                sessionStorage.setItem('userName', form.username);
                sessionStorage.setItem('userId', res.userId);
                sessionStorage.setItem('token', res.token);
                sessionStorage.setItem('sexo', res.sexo);
                sessionStorage.setItem('imagen', res.imagen);
                if (!res.cultoTipo) {
                  if (!sessionStorage.getItem('register')) {
                    this.dismiss();
                    this.router.navigate(['/']);
                  } else {
                    sessionStorage.removeItem('register');
                  }
                }
                if (this.return === '/') {
                  this.return = '/';
                }
              }
              break;
            case 1:
              this.utilsService.presentToastLanguage('LOGIN_TS.USER_NO_EXIST');
              break;
            case 2:
              this.utilsService.presentToastLanguage('LOGIN_TS.PASSWORD_ERROR');
              break;
            case 3:
              this.utilsService.presentToastLanguage('LOGIN_TS.TOKEN_CHECK_ERROR');
              break;
            case 4:
              this.utilsService.presentToastLanguage('LOGIN_TS.USER_NOT_ACCEPTED_PRIVACY_CONDITIONS');
              break;
            case 5:
              this.utilsService.presentToastLanguage('LOGIN_TS.USER_NOT_ACTIVE');
              break;
            case 6:
              this.utilsService.presentToastLanguage('LOGIN_TS.USER_NOT_EXIST');
              break;
            case 7:
              this.utilsService.presentToastLanguage('LOGIN_TS.USER_NOT_SUPPLIED');
              break;
            default:
              if (res.msg) {
                this.utilsService.presentToast(res.msg, 3000, '-danger');
              } else {
                this.utilsService.presentToastLanguage('LOGIN_TS.SERVER_ERROR');
              }
              break;
          }
        });
      }, (err) => {
        console.error(err);
        this.utilsService.presentToastLanguage('LOGIN_TS.SERVER_ERROR');
        this.dismiss();
      });
  }



  onRememberChange(remember) {
    if (remember && localStorage.getItem('userName') && localStorage.getItem('password')) {
      this.username = localStorage.getItem('userName');
      this.password = CryptoJS.AES.decrypt(localStorage.getItem('password'), this.secret).toString(CryptoJS.enc.Utf8);
    }
  }

  modifyPassword() {
    if (this.username === '') {
      this.utilsService.presentToastLanguage('LOGIN_TS.USERNAME_REQUIRED');
    } else {
      this.utilsService.presentLoadingWithOptions().then(() => {
        this.authService.modifyPassword({ username: this.username, regenerate: true , lang: this._language})
          .subscribe(res => {
            this.dismiss().then(() => {
              if (res.error !== undefined) {
                res = res.error;
              }
              switch (res.code) {
                case 1:
                  this.utilsService.presentToastLanguage('LOGIN_TS.USER_NOT_SUPPLIED');
                  break;
                case 3:
                  this.utilsService.presentToastLanguage('LOGIN_TS.USER_NOT_FOUND', { username: this.username });
                  break;
                case 4:
                  this.utilsService.presentToastLanguage('LOGIN_TS.EMAIL_SEND', { email: res.email });
                  break;
                case 5:
                  this.utilsService.presentToastLanguage('LOGIN_TS.EMAIL_SEND_ERROR', { email: res.email });
                  break;
                case 6:
                  this.utilsService.presentToastLanguage('LOGIN_TS.TOKEN_UPDATE_ERROR');
                  break;
                default:
                  if (res.msg) {
                    this.utilsService.presentToast(res.msg, 3000, '-danger');
                  } else {
                    this.utilsService.presentToastLanguage('LOGIN_TS.SERVER_ERROR');
                  }
                  break;
              }
            });
          }, (err) => {
            console.error(err);
            this.utilsService.presentToastLanguage('LOGIN_TS.SERVER_ERROR');
            this.dismiss();
          });
      });
    }
  }

  dismiss() {
    return this.utilsService.dismiss();
  }

  register() {
    this.router.navigate(['register']);
  }

  /**
   * It is used to open a window with the legal text depending on who invokes it
   * @param action Button action: 'register' | 'google'
   * @param privacyText Name of text legal variable: 'dataPrivacyText' : 'legalConditionsText'
   */
  async showAlertPrivacyData(action: string, privacyText = 'dataPrivacyText') {
    let lNameMulti: any = this[privacyText].name_multi[this._language];
    let lTextMulti: any = this[privacyText].text_multi[this._language];
    lNameMulti = lNameMulti ? lNameMulti : this[privacyText].name;
    lTextMulti = lTextMulti ? lTextMulti : this[privacyText].text;
    const alert = await this.alertController.create({
      cssClass: 'condiciones-legales-alert',
      header: lNameMulti,
      message: lTextMulti.replace(/\n/g, '<br />'),
      buttons: [
        {
          text: this[privacyText].not_agree,
          handler: () => { }
        },
        {
          text: this[privacyText].agree,
          handler: () => {
            if (action === 'register') {
              this.register();
            } else if (action === 'google') {
              if (privacyText === 'legalConditionsText') {
                this.googleLoginService.googleLogin();
              } else {
                this.showAlertPrivacyData('google', 'legalConditionsText');
              }
            }
          }
        }
      ]
    });

    await alert.present();
  }

  changeVisibilityPassword() {
    this.showPassword = !this.showPassword;
  }

  ngOnDestroy() {
    if (this._translateServiceSubscription) {
      this._translateServiceSubscription.unsubscribe();
    }
    if (this._showKeyboardSubscription) {
      this._showKeyboardSubscription.unsubscribe();
    }
    if (this._hideKeyboardSubscription) {
      this._hideKeyboardSubscription.unsubscribe();
    }
  }

}
