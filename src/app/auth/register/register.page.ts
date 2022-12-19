import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service';
import * as CryptoJS from 'crypto-js';
import { myInitObject } from '../../config/config';
import { Subscription } from 'rxjs';
import { TranslateConfigService } from 'src/app/services/translate-config.service';
 

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit, OnDestroy {

  registerForm: FormGroup;
  
  barLabel = 'Consistencia contraseña:';
  myColors = ['#DD2C00', '#FF6D00', '#FFD600', '#AEEA00', '#00C853'];
  password = '';
  loaded = false;
  textoLegal: { nombre: '', nombre_multi: [], texto: '', texto_multi: [] };
  secret = atob(myInitObject.secretPassword);
  private _language;
  private _closeButton;
  private _translateServiceSubscription: Subscription;
  

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private utilsService: UtilsService,
    public toastController: ToastController,
    public alertController: AlertController,
    private translateConfigService: TranslateConfigService) { }

  ngOnInit() {
    this._translateServiceSubscription = this.translateConfigService.language.subscribe(language => {
      this._language = language;
      if (this.textoLegal && this.textoLegal.nombre_multi) {
        let lNameMulti: any = this.textoLegal.nombre_multi[this._language];
        let lTextMulti: any = this.textoLegal.texto_multi[this._language];
        lNameMulti = lNameMulti ? lNameMulti : this.textoLegal.nombre;
        lTextMulti = lTextMulti ? lTextMulti : this.textoLegal.texto;
        this.textoLegal.nombre = lNameMulti;
        this.textoLegal.texto = lTextMulti;
        
      }
      this.utilsService.translateLanguage('REGISTER_TS.CLOSE').subscribe(res => {
        this._closeButton = res;
      });
    });
    this.utilsService.translateLanguage('REGISTER_TS.PASSWORD_CONSISTENCE').subscribe(res => {
      this.barLabel = res;
    });
    const passw = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[^ ]{8,20}$/;
    this.registerForm = this.formBuilder.group({
      nombre: [null, Validators.required],
      apellidos: [null, Validators.required],
      email: [null, Validators.required],
      password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(20),
      Validators.pattern(passw)]],
      password2: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(20),
      Validators.pattern(passw)]],
      acepto_privacidad: [null, Validators.required],
      acepto_comercial: [null],
      acepto_compartir: [null]
    });
    this.loaded = true;
  }

  onSubmit()
  {
    
  }

  ionViewWillEnter() {
    this.utilsService.presentLoadingWithOptions().then(() => {
      this.authService.textoLegalList().subscribe(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          let lText = data.find(text => text.TypeLegalText.name.en.toLowerCase().includes('legal conditions'));
          if (lText) {
            this.dismiss().then(() => {
              let lNameMulti: any = lText[this._language];
              let lTextMulti: any = lText.texto_multi[this._language];
              lNameMulti = lNameMulti ? lNameMulti : lText.nombre;
              lTextMulti = lTextMulti ? lTextMulti : lText.texto;
              this.textoLegal = {
                nombre: lNameMulti,
                nombre_multi: lText.nombre_multi,
                texto: lTextMulti.replace(/\n/g, '<br />'),
                texto_multi: lText.texto_multi
              };
            });
          } else {
            this.dismiss();
          }
        }
      }, (err) => {
        this.dismiss();
        console.error(err);
        this.utilsService.presentToastLanguage('REGISTER_TS.SERVER_ERROR');
      });
    });
  }

  ionViewWillLeave() {
    return this.utilsService.dismiss();
  }

  onFormSubmit(registerForm: any) {
    const form = registerForm.value;
    const passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[^ ]{8,20}$/;
    if (!form.password || !form.password2) {
      this.presentAlertTranslation('REGISTER_TS.INCORRECT_REGISTRATION', 'REGISTER_TS.PASSWORD_MISSING');
    } else if (form.password !== form.password2) {
      this.presentAlertTranslation('REGISTER_TS.INCORRECT_REGISTRATION', 'REGISTER_TS.PASSWORD_CONSISTENCE_NOT_EQUALS');
    } else if (!form.password.match(passw)) {
      this.presentAlertTranslation('REGISTER_TS.INCORRECT_REGISTRATION', 'REGISTER_TS.PASSWORD_REQUIRED_ERROR');
    } else if (registerForm.dirty && registerForm.valid) {
      this.utilsService.presentLoadingWithOptions().then(() => {
        form.validado = true;
        this.authService.register(form)
          .subscribe((res) => {
            this.dismiss().then(() => {
              const user = res.user;
              localStorage.setItem('remember', '1');
              localStorage.setItem('password', CryptoJS.AES.encrypt(form.password, this.secret).toString());
              localStorage.setItem('userName', user.username);
              sessionStorage.setItem('name', user.name);
              sessionStorage.setItem('userId', user.userId);
              sessionStorage.setItem('token', user.token);
              sessionStorage.setItem('sexo', user.sexo);
              // this.presentAlert('Registro correcto.', 'Usuario registrado y activado.');
              this.router.navigate(['login']);
            });
          }, (err) => {
            this.dismiss();
            console.log(err);
            this.utilsService.presentToastLanguage('REGISTER_TS.SERVER_ERROR');
          });
      });
    }
  }

  async condiciones_legales() {
    let lNameMulti: any = this.textoLegal.nombre_multi[this._language];
    let lTextMulti: any = this.textoLegal.texto_multi[this._language];
    lNameMulti = lNameMulti ? lNameMulti : this.textoLegal.nombre;
    lTextMulti = lTextMulti ? lTextMulti : this.textoLegal.texto;
    const alert = await this.alertController.create({
      cssClass: 'condiciones-legales-alert',
      header: lNameMulti,
      message: lTextMulti.replace(/\n/g, '<br />'),
      buttons: [{
        text: this._closeButton,
        handler: () => { }
      }]
    });

    await alert.present();
  }

  private presentAlertTranslation(title: string, message: string) {
    this.utilsService.translateLanguage(title).subscribe(tit => {
      this.utilsService.translateLanguage(message).subscribe(mes => {
        this.presentAlert(tit, mes);
      })
    });
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.router.navigate(['login']);
        }
      }]
    });

    await alert.present();
  }

  dismiss() {
    this.loaded = true;
    return this.utilsService.dismiss();
  }

  ngOnDestroy() {
    if (this._translateServiceSubscription) {
      this._translateServiceSubscription.unsubscribe();
    }
  }

}
