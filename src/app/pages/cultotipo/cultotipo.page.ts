import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Router } from '@angular/router';
import { myInitObject } from '../../config/config';
import { NavController } from '@ionic/angular';
import { TranslateConfigService } from '../../services/translate-config.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-cultotipo',
  templateUrl: './cultotipo.page.html',
  styleUrls: ['./cultotipo.page.scss'],
})
export class CultotipoPage implements OnInit {

  loaded = false;
  userId = parseInt(sessionStorage.getItem('userId'), 10);
  cultoTipo = null;
  sexo = sessionStorage.getItem('sexo') || 'M';
  titleMan = null;
  titleWoman = null;
  description = null;

  private _language;
  private _translateServiceSubscription: Subscription;

  constructor(
    private apiService: ApiService,
    private utilsService: UtilsService,
    private navController: NavController,
    private translateService: TranslateConfigService,
    public router: Router
  ) { }

  ngOnInit() { }

  ionViewWillLeave() {
    if (this._translateServiceSubscription) {
      this._translateServiceSubscription.unsubscribe()
    }
    return this.utilsService.dismiss();
  }

  ionViewWillEnter() {
    this.userId = parseInt(sessionStorage.getItem('userId'), 10);
    this.sexo = sessionStorage.getItem('sexo') || 'M';
    this.utilsService.presentLoadingWithOptions().then(() => {
      this.apiService.cultoTipoUser(this.userId)
        .subscribe((res) => {
          if (res && !res.status) {
            this.dismiss().then(() => {
              this.cultoTipo = res.CultoTipo;
              this.titleWoman = this.cultoTipo.nombre;
              this.titleMan = this.cultoTipo.nombreH;
              if (this.cultoTipo.imagen) {
                if (this.cultoTipo.imagen.indexOf('data:imagen/')) {
                  this.cultoTipo.imgUrl = this.cultoTipo.imagen;
                } else {
                  this.cultoTipo.imgUrl = myInitObject.apiUrl + 'image/' + this.cultoTipo.imagen;
                }
              }
              this._translateServiceSubscription = this.translateService.language.subscribe(language => {
                this._language = language;
                this.changeAttributesByLanguage();
              });
            });
          } else {
            this.dismiss();
            this.utilsService.presentToastLanguage('CULTOTIPO_TS.SERVER_ERROR');
          }
        }, (err) => {
          this.dismiss();
          console.error(err);
          this.utilsService.presentToastLanguage('CULTOTIPO_TS.SERVER_ERROR');
        });
    });
  }

  onClickVerPerfil() {
    this.navController.navigateRoot(['/editar-usuario']);
  }

  onClickGoHome() {
    this.navController.navigateRoot(['/']);
  }

  dismiss() {
    this.loaded = true;
    return this.utilsService.dismiss();
  }

  /**
   * Change attributes when change language
   */
  changeAttributesByLanguage() {
    this.description = this.changeAttributeByLanguage(this.cultoTipo.descripcion, this.cultoTipo.descripcion_multi);
    this.titleWoman = this.changeAttributeByLanguage(this.cultoTipo.nombre, this.cultoTipo.nombre_multi);
    this.titleMan = this.changeAttributeByLanguage(this.cultoTipo.nombreH, this.cultoTipo.nombreH_multi)
  }

  /**
   * Change an atribute to language
   * @param singleAttribute Single attribute
   * @param multiAttribute Array to contains multilanguage
   * @returns Return the text changed. When not exist english translation return single attribute
   */
  private changeAttributeByLanguage(singleAttribute, multiAttribute) {
    let text = singleAttribute;
    if (multiAttribute) {
      if (multiAttribute[this._language]) {
        text = multiAttribute[this._language];
      } else {
        text = multiAttribute.en ? multiAttribute.en : singleAttribute;
      }
    }
    return text;
  }
}
