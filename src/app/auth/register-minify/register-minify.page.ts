import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service';
import * as CryptoJS from 'crypto-js';
import { myInitObject } from '../../config/config';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register-minify',
  templateUrl: './register-minify.page.html',
  styleUrls: ['./register-minify.page.scss'],
})
export class RegisterMinifyPage implements OnInit, OnDestroy {

  @ViewChild('passwordEyeRegister', { static: false }) passwordEye: ElementRef;
  registerForm: FormGroup;
  barLabel = 'Consistencia contraseña:';
  myColors = ['#DD2C00', '#FF6D00', '#FFD600', '#AEEA00', '#00C853'];
  password = '';
  loaded = false;
  textoLegal: { nombre: '', nombre_multi: [], texto: '', texto_multi: [] };
  secret = atob(myInitObject.secretPassword);
  private _translateServiceSubscription: Subscription;
  passwordTypeInput = 'password';
  showFacebookLoginButton = false;
  showGoogleLoginButton = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private utilsService: UtilsService,
    public toastController: ToastController,
    public alertController: AlertController) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: [null, Validators.required],
      password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(20)]]
    });
    this.loaded = true;
  }

  async showAlertPrivacyData(action: string, privacyText = 'dataPrivacyText') {
  
  }
  onFormSubmit(registerForm: any) {
    const form = registerForm.value;
    if (!form.password && !form.email) {
      this.presentAlertTranslation('REGISTER_TS.INCORRECT_REGISTRATION', 'REGISTER_TS.PASSWORD_MISSING');
    } else if (registerForm.dirty && registerForm.valid) {
      this.utilsService.presentLoadingWithOptions().then(() => {
        form.nombre = form.email.split('@')[0];
        form.apellidos = form.nombre;
        form.username = form.email;
        form.validado = true;
        this.authService.registerMinify(form)
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
              sessionStorage.setItem('register', '1');
              this.router.navigate(['login']);
              // this.presentAlert('Registro correcto.', 'Usuario registrado y activado.');
            });
          }, (err) => {
            this.dismiss();
            console.log(err);
            this.utilsService.presentToastLanguage('REGISTER_TS.SERVER_ERROR');
          });
      });
    }
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

  login() {
    this.router.navigate(['login']);
  }

  ngOnDestroy() {
    if (this._translateServiceSubscription) {
      this._translateServiceSubscription.unsubscribe();
    }
  }

  changeVisibilityPassword(event) {
    event.preventDefault();
    this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
  }


}
