import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from 'src/app/services/utils.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modify-password',
  templateUrl: './modify-password.page.html',
  styleUrls: ['./modify-password.page.scss'],
})
export class ModifyPasswordPage implements OnInit {

  modifyForm: FormGroup;
  username = '';
  password = '';
  confirmpassword = '';
  token = '';
  linkRegenerate = false;
  linkBack = false;
  loaded = false;
  barLabel = 'Consistencia contraseña:';
  myColors = ['#DD2C00', '#FF6D00', '#FFD600', '#AEEA00', '#00C853'];

  constructor(private formBuilder: FormBuilder,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private utilsService: UtilsService) { }

  ngOnInit() {
    this.utilsService.translateLanguage('MODIFY_PASSWORD_TS.PASSWORD_CONSISTENCE').subscribe(res => {
      this.barLabel = res;
    });
    const passw = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[^ ]{8,20}$/;
    this.modifyForm = this.formBuilder.group({
      password: [this.username, [Validators.required, Validators.minLength(8), Validators.maxLength(20),
      Validators.pattern(passw)]],
      confirmpassword: [this.password, [Validators.required, Validators.minLength(8), Validators.maxLength(20),
      Validators.pattern(passw)]]
    });
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.username = params['params']['username'];
      this.token = params['params']['token'];
      if (!this.username || !this.token) {
        this.utilsService.presentToastLanguage('MODIFY_PASSWORD_TS.PARAMETERS_ERROR');
      }
    });
    this.loaded = true;
  }

  ionViewWillLeave() {
    return this.utilsService.dismiss();
  }

  onFormSubmit(form: any) {
    const passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[^ ]{8,20}$/;
    if (!this.password || !this.confirmpassword) {
      this.utilsService.presentToastLanguage('MODIFY_PASSWORD_TS.PASSWORD_MISSING');
    } else if (this.password !== this.confirmpassword) {
      this.utilsService.presentToastLanguage('MODIFY_PASSWORD_TS.PASSWORD_CONSISTENCE_NOT_EQUALS');
    } else if (!this.password.match(passw)) {
      this.utilsService.presentToastLanguage('MODIFY_PASSWORD_TS.PASSWORD_REQUIRED_ERROR');
    } else {
      this.utilsService.presentLoadingWithOptions().then(() => {
        this.authService.modifyPassword({ username: this.username, token: this.token, password: this.password })
          .subscribe((res) => {
            this.dismiss().then(() => {
              if (res.error !== undefined) {
                res = res.error;
              }
              this.showMsg(res);
            });
          }, (err) => {
            console.error(err);
            this.utilsService.presentToastLanguage('MODIFY_PASSWORD_TS.SERVER_ERROR');
            this.dismiss();
          });
      });
    }
  }

  regenerate() {
    this.utilsService.presentLoadingWithOptions().then(() => {
      this.authService.modifyPassword({ username: this.username, regenerate: true, token: this.token }).subscribe((res) => {
        this.dismiss().then(() => {
          this.linkRegenerate = false;
          this.showMsg(res);
        });
      }, (err) => {
        console.error(err);
        this.utilsService.presentToastLanguage('MODIFY_PASSWORD_TS.SERVER_ERROR');
        this.dismiss();
      });
    });
  }

  goAuth() {
    this.router.navigate(['login']);
  }

  showMsg(res: any) {
    switch (res.code) {
      case 0:
        this.linkBack = true;
        this.utilsService.presentToastLanguage('MODIFY_PASSWORD_TS.PASSWORD_CHANGED', { username: this.username });
        break;
      case 3:
        this.utilsService.presentToastLanguage('MODIFY_PASSWORD_TS.USER_NOT_FOUND', { username: this.username });
        break;
      case 4:
        this.utilsService.presentToastLanguage('MODIFY_PASSWORD_TS.TOKEN_GENERATED', { email: res.email });
        break;
      case 5:
        this.utilsService.presentToastLanguage('MODIFY_PASSWORD_TS.EMAIL_NOT_SENT', { email: res.email });
        break;
      case 6:
        this.utilsService.presentToastLanguage('MODIFY_PASSWORD_TS.TOKEN_NOT_UPDATED');
        break;
      case 7:
        this.utilsService.presentToastLanguage('MODIFY_PASSWORD_TS.PASSWORD_NOT_UPDATED');
        break;
      case 8:
        this.linkRegenerate = true;
        this.utilsService.presentToastLanguage('MODIFY_PASSWORD_TS.TOKEN_EXPIRED', { tokenTime: res.tokenTime });
        break;
      case 9:
        this.utilsService.presentToastLanguage('MODIFY_PASSWORD_TS.NEW_TOKEN');
        break;
      default:
        if (res.msg) {
          this.utilsService.presentToast(res.msg, 3000, '-danger');
        } else {
          this.utilsService.presentToastLanguage('MODIFY_PASSWORD_TS.SERVER_ERROR');
        }
        break;
    }
  }

  dismiss() {
    this.loaded = true;
    return this.utilsService.dismiss();
  }

}
