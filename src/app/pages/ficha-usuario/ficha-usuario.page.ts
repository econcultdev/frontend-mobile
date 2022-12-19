import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateConfigService } from 'src/app/services/translate-config.service';
import { UtilsService } from 'src/app/services/utils.service';
import { myInitObject } from '../../config/config';

@Component({
  selector: 'app-ficha-usuario',
  templateUrl: './ficha-usuario.page.html',
  styleUrls: ['./ficha-usuario.page.scss'],
})
export class FichaUsuarioPage implements OnInit {

  userId = parseInt(sessionStorage.getItem('userId'), 10);
  username = sessionStorage.getItem('userName');
  name = sessionStorage.getItem('name') || this.username;
  encuestas = [];
  numEncuestas = { finalizadas: 0, noFinalizadas: 0 };
  loaded = false;
  cultoTipo = null;
  bonos = [];
  sexo = sessionStorage.getItem('sexo') || 'M';
  titleMan = null;
  titleWoman = null;
  description = null;

  private _language;
  private _translateServiceSubscription: Subscription;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private utilsService: UtilsService,
    private translateService: TranslateConfigService,
    public router: Router) { }

  ngOnInit() {
  }

  ionViewWillLeave() {
    if (this._translateServiceSubscription) {
      this._translateServiceSubscription.unsubscribe()
    }
    return this.utilsService.dismiss();
  }

  ionViewWillEnter() {
    this.userId = parseInt(sessionStorage.getItem('userId'), 10);
    this.loaded = false;
    this.encuestas = [];
    this.numEncuestas = { finalizadas: 0, noFinalizadas: 0 };
    this.cultoTipo = null;
    this.name = sessionStorage.getItem('name') || this.username;
    this.sexo = sessionStorage.getItem('sexo') || 'M';
    this.utilsService.presentLoadingWithOptions().then(() => {
      this.apiService.listEncuestasUser(this.userId)
        .subscribe((res) => {
          if (res && !res.status) {
            this.encuestas = res;
            for (const enc of this.encuestas) {
              if (enc.EncuestaUserFinalizada.length && enc.EncuestaUserFinalizada[0].finalizada) {
                this.numEncuestas.finalizadas += 1;
              } else {
                const fechaCierreEncuesta = new Date(enc.fecha_cierre_encuesta);
                const now = new Date();
                if (enc.activo && now < fechaCierreEncuesta) {
                  this.numEncuestas.noFinalizadas += 1;
                }
              }
            }
            this.apiService.cultoTipoUser(this.userId)
              .subscribe((resC) => {
                if (resC && !resC.status) {
                  this.cultoTipo = resC.CultoTipo;
                  if (this.cultoTipo.imagen) {
                    if (this.cultoTipo.imagen.indexOf('data:imagen/')) {
                      this.cultoTipo.imgUrl = this.cultoTipo.imagen;
                    } else {
                      this.cultoTipo.imgUrl = myInitObject.apiUrl + 'image/' + this.cultoTipo.imagen;
                    }
                  }
                }
                this.dismiss().then(() => {
                  this._translateServiceSubscription = this.translateService.language.subscribe(language => {
                    this._language = language;
                    this.changeAttributesByLanguage();
                  });
                });
              }, (err) => {
                this.dismiss();
                console.error(err);
                this.utilsService.presentToast('Error al comunicarse con el servidor', 3000, '-danger');
              });

          } else {
            this.dismiss();
          }
        }, (err) => {
          this.dismiss();
          console.error(err);
          this.utilsService.presentToast('Error al comunicarse con el servidor', 3000, '-danger');
        });
    });
  }

  dismiss() {
    this.loaded = true;
    return this.utilsService.dismiss();
  }

  listEncuestas() {
    this.router.navigate(['app/home/encuestas-realizadas']);
  }

  editUserRecord() {
    this.router.navigate(['app/home/editar-usuario']);
  }

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

  logout() {
    sessionStorage.setItem('logout', '1');
    this.authService.logout().subscribe(() => {
      this.router.navigateByUrl('/eventos-destacados');
    });
  }

  /**
   * Change attributes when change language
   */
  changeAttributesByLanguage() {
    if (this.cultoTipo) {
      this.description = this.changeAttributeByLanguage(this.cultoTipo.descripcion, this.cultoTipo.descripcion_multi);
      this.titleWoman = this.changeAttributeByLanguage(this.cultoTipo.nombre, this.cultoTipo.nombre_multi);
      this.titleMan = this.changeAttributeByLanguage(this.cultoTipo.nombreH, this.cultoTipo.nombreH_multi)
    }
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
