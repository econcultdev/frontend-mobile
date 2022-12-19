import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController } from '@ionic/angular';
import * as CryptoJS from 'crypto-js';
import { myInitObject } from '../../config/config';
import { TranslateConfigService } from 'src/app/services/translate-config.service';
import { ApiService } from 'src/app/services/api.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

//import { ImagePicker } from '@ionic-native/image-picker/ngx';


//import {  Plugins  } from '@capacitor/core';

import { ProfilePhotoOptionComponent } from 'src/app/components/profile-photo-option/profile-photo-option.component';
import { Subscription } from 'rxjs';
//import { url } from 'inspector';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.page.html',
  styleUrls: ['./editar-usuario.page.scss'],
})
export class EditarUsuarioPage implements OnInit {

  verifylogin = false;
  photo;//='https://i.pravatar.cc/150';
  userId = parseInt(sessionStorage.getItem('userId'), 10);
  loaded = false;
  editUserForm: FormGroup;
  nombre = '';
  apellidos = '';
  email = '';
  password = '';
  confirmpassword = '';
  acepto_comercial = false;
  acepto_compartir = false;
  secret = atob(myInitObject.secretPassword);
  barLabel = 'Consistencia contraseña:';
  myColors = ['#DD2C00', '#FF6D00', '#FFD600', '#AEEA00', '#00C853'];
  imagenprofile = null;
  //public countlist;
  paisId = 0;
  pais = '';
  imagen = null;
  countries: any[] = [];
  capturedSnapURL: string;

  imgval = true;
  cultoTipo = null;
  titleMan = null;
  titleWoman = null;
  description = null;
  sexo = 'M';
  private _language;
  private _translateServiceSubscription: Subscription;


  cameraOptions: CameraOptions = {
    quality: 20,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

  navigateHome() {
    this.router.navigate(['app/homeapp/'])
  }

  constructor(private formBuilder: FormBuilder,
    private apiService: ApiService,
    private utilsService: UtilsService,
    private authService: AuthService,
    public router: Router,
    public alertController: AlertController,
    private camera: Camera,
    private translateService: TranslateConfigService,
    //private imgPicker: ImagePicker,
  ) { }


  takeSnap() {
    this.camera.getPicture(this.cameraOptions).then((imageData) => {
      // this.camera.DestinationType.FILE_URI gives file URI saved in local
      // this.camera.DestinationType.DATA_URL gives base64 URI

      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.imagen = base64Image;
      this.photo = base64Image;
      this.capturedSnapURL = base64Image;
    }, (err) => {
      console.log(err);
      // Handle error
    });
  }

  ngOnInit() {
    this.apiService.getCountries().subscribe(countries => this.countries = countries ? countries : []);
    if (this.authService.whoAmI()) {
      this.verifylogin = true;
    } else {
      this.verifylogin = false;
    }
  }

  ionViewWillLeave() {
    //this.translateService.dismissPopover();
    this.utilsService.dismiss();
  }

  ionViewWillEnter() {
    this.userId = parseInt(sessionStorage.getItem('userId'), 10);
    this.sexo = '';
    this.loaded = false;
    this.nombre = '';
    this.apellidos = '';
    this.email = '';
    this.confirmpassword = '';
    this.password = '';
    this.acepto_comercial = false;
    this.acepto_compartir = false;
    this.paisId = 0;
    this.pais = '';
    this.imagen = null;
    const passw = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[^ ]{8,20}$/;
    this.editUserForm = this.formBuilder.group({
      nombre: [null, Validators.required],
      apellidos: [null, Validators.required],
      email: [null, Validators.required],
      password: [null, [Validators.minLength(8), Validators.maxLength(20),
      Validators.pattern(passw)]],
      confirmpassword: [null, [Validators.minLength(8), Validators.maxLength(20),
      Validators.pattern(passw)]],
      acepto_comercial: [null],
      acepto_compartir: [null],
      paisId: [null, Validators.required],
      pais: [null],
      imagen: [null]
    });
    this.utilsService.presentLoadingWithOptions().then(() => {
      this.authService.editUser(this.userId)
        .subscribe((user) => {
          if (user && !user.status && user.username === sessionStorage.getItem('userName')) {
            this.dismiss().then(() => {
              this.nombre = user.nombre;
              this.apellidos = user.apellidos;
              this.email = user.email;
              this.acepto_comercial = user.acepto_comercial;
              this.acepto_compartir = user.acepto_compartir;
              this.paisId = user.paisId || 0;
              this.pais = user.pais || '';
              this.sexo = user.sexo || 'M';
              if (user.imagen != null)
                this.photo = user.imagen;

            });
          } else {
            this.dismiss();
            this.utilsService.presentToast('Usuario no válido', 3000, '-danger');
          }
        }, (err) => {
          this.dismiss();
          console.error(err);
          this.utilsService.presentToast('Error al comunicarse con el servidor', 3000, '-danger');
        });
    });
/*
    this.cultoTipo = null;
    this.apiService.cultoTipoUser(this.userId)
      .subscribe((resC) => {
        if (resC && !resC.status) {
          this.cultoTipo = resC.CultoTipo;
        }
        this.dismiss().then(() => {
          this._translateServiceSubscription = this.translateService.language.subscribe(language => {
            this._language = language;
            this.changeAttributesByLanguageType();
          });
        });
      }, (err) => {
        this.dismiss();
        console.error(err);
        this.utilsService.presentToast('Error al comunicarse con el servidor', 3000, '-danger');
      });
      */

  }

  changeAttributesByLanguageType() {
    if (this.cultoTipo) {
      this.description = this.changeAttributesByLanguage(this.cultoTipo.descripcion, this.cultoTipo.descripcion_multi);
      this.titleWoman = this.changeAttributesByLanguage(this.cultoTipo.nombre, this.cultoTipo.nombre_multi);
      this.titleMan = this.changeAttributesByLanguage(this.cultoTipo.nombreH, this.cultoTipo.nombreH_multi)
    }
  }

  onFormSubmit(form: any) {
    const passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[^ ]{8,20}$/;
    let ok = true;
    if (form.password && form.confirmpassword) {
      if (form.password !== form.confirmpassword) {
        this.presentAlert('Modificación incorrecta.', 'La confirmación de la contraseña no es igual que la contraseña');
        ok = false;
      } else if (!form.password.match(passw)) {
        this.presentAlert('Modificación incorrecta.', 'Las contraseña no tiene el criterio de: mínimo 8 caracteres, máximo 20 caracteres.' +
          ' Ha de tener mayúsculas, minúsculas, números y no ha de tener espacios.');
        ok = false;
      }
    }
    if (ok) {
      this.utilsService.presentLoadingWithOptions().then(() => {
        let obj = null;
        if (this.password) {
          obj = {
            id: this.userId, nombre: this.nombre, apellidos: this.apellidos, email: this.email,
            username: sessionStorage.getItem('userName'), password: this.password, acepto_comercial: form.acepto_comercial,
            acepto_compartir: form.acepto_compartir, PaisId: this.paisId, imagen: this.photo
          };
        } else {
          obj = {
            id: this.userId, nombre: this.nombre, apellidos: this.apellidos, email: this.email,
            username: sessionStorage.getItem('userName'), acepto_comercial: form.acepto_comercial,
            acepto_compartir: form.acepto_compartir, PaisId: this.paisId, imagen: this.photo
          };
        }
        this.authService.updateUser(obj)
          .subscribe(_ => {
            this.dismiss().then(() => {
              if (localStorage.getItem('remember') === '1' && this.password) {
                localStorage.setItem('password', CryptoJS.AES.encrypt(this.password, this.secret).toString());
              }
              sessionStorage.setItem('name', this.nombre);
              sessionStorage.setItem('imagen', this.photo);
              this.presentAlert('Usuario modificado.', '');
            });
          }, (err) => {
            this.dismiss();
            console.log(err);
            this.utilsService.presentToast('Error al comunicarse con el servidor', 3000, '-danger');
          });
      });
    }
  }

  dismiss() {
    this.loaded = true;
    this.translateService.dismissPopover();
    return this.utilsService.dismiss();
  }

  /**
   * Change attributes when change language
   */
  changeAttributesByLanguage(singleValue, multiLanguageValue) {
    return this.utilsService.changeAttributesByLanguage(singleValue, multiLanguageValue);

  }


  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [{
        text: 'OK',
        handler: () => {
        }
      }]
    });

    await alert.present();
  }

  changeCountrySelected(country: any) {
    try {
      if (country && country.detail && country.detail.value && country.detail.value.id) {
        this.paisId = country.detail.value.id;
        this.pais = country.detail.value.nombre;
      }
    } catch (e) {

    }
  }

  openOptionSelection() {

  }

  logout() {
    sessionStorage.setItem('logout', '1');
    this.authService.logout().subscribe(() => {
      this.router.navigateByUrl('/');
    });
  }



  async loadImageFromDevice(event) {
    const file = event.target.files[0];
    const toBase64 = file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
    const result = await toBase64(file).catch(e => Error(e));
    this.imagen = result;
    this.photo = result;
    if (result !== null)
      this.imgval = true;
    if (result instanceof Error) {
      console.log('Error: ', result.message);
      return;
    }
  };


  modEncuestaPersonal() {
    this.apiService.cultoTipoBorrarRespuestaUser(this.userId)
      .subscribe((res) => {
        if (res !== undefined && !res.status) {
          this.router.navigate(['encuesta-personal']);
        }
      }, (err) => {
        this.dismiss();
        console.error(err);
        this.utilsService.presentToast('Error al comunicarse con el servidor', 3000, '-danger');
      });
  }


}
