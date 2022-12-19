import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { myInitObject } from '../../config/config';
import { Platform, NavController } from '@ionic/angular';
import { TranslateConfigService } from 'src/app/services/translate-config.service';

@Component({
  selector: 'app-encuestas-realizadas',
  templateUrl: './encuestas-realizadas.page.html',
  styleUrls: ['./encuestas-realizadas.page.scss'],
})
export class EncuestasRealizadasPage implements OnInit {

  userId = parseInt(sessionStorage.getItem('userId'), 10);
  username = sessionStorage.getItem('userName');
  numEncuestas = { finalizadas: 0, noFinalizadas: 0 };
  tipoEventos = [];
  encuestasScroll = [];
  loaded = false;
  offset = myInitObject.encuestasRealizadas.offset;
  loadingSpinner: any;

  constructor(private apiService: ApiService,
    private utilsService: UtilsService,
    public router: Router,
    private platform: Platform,
    private iab: InAppBrowser,
    private navController: NavController) { }

  ngOnInit() {
  }

  ionViewWillLeave() {
    return this.utilsService.dismiss();
  }

  ionViewWillEnter() {
    this.userId = parseInt(sessionStorage.getItem('userId'), 10);
    this.loaded = false;
    this.tipoEventos = [];
    this.offset = 0;
    this.numEncuestas = { finalizadas: 0, noFinalizadas: 0 };
    this.encuestasScroll = [];
    this.utilsService.presentLoadingWithOptions().then(() => {
      this.apiService.listEncuestasUserWithEventos(this.userId, null)
        .subscribe((encuestas) => {
          if (encuestas && !encuestas.status) {
            const tEventos = {};
            for (const enc of encuestas) {
              if (enc.EncuestaUserFinalizada.length && enc.EncuestaUserFinalizada[0].finalizada) {
                this.numEncuestas.finalizadas += 1;
                if (tEventos[enc.Eventos.TipoEvento.id] === undefined) {
                  tEventos[enc.Eventos.TipoEvento.id] = { nombre: enc.Eventos.TipoEvento.nombre, num: 0 };
                }
                tEventos[enc.Eventos.TipoEvento.id].num++;
              } else {
                const fechaCierreEncuesta = new Date(enc.fecha_cierre_encuesta);
                const now = new Date();
                if (enc.activo && now < fechaCierreEncuesta) {
                  this.numEncuestas.noFinalizadas += 1;
                }
              }
            }
            for (const ev in tEventos) {
              if (ev) {
                this.tipoEventos.push(tEventos[ev]);
              }
            }
            this.tipoEventos.sort((a, b) => (a.num > b.num) ? 1 : (a.num === b.num) ? ((a.nombre > b.nombre) ? 1 : -1) : -1);

            this.apiService.listEncuestasUserWithEventosLimit(myInitObject.encuestasRealizadas.limit,
              this.offset, this.userId)
              .subscribe((resE) => {
                if (resE && !resE.status) {
                  for (const encuesta of resE) {
                    if (encuesta.Eventos.imagen) {
                      if (encuesta.Eventos.imagen.indexOf('data:imagen/')) {
                        encuesta.imgUrl = encuesta.Eventos.imagen;
                      } else {
                        encuesta.imgUrl = myInitObject.apiUrl + 'image/' + encuesta.Eventos.imagen;
                      }
                    }
                    this.encuestasScroll.push(encuesta);
                  }
                  this.offset = this.encuestasScroll.length;
                  this.dismiss().then(() => {
                  });
                } else {
                  this.dismiss();
                }
              }, (err) => {
                this.dismiss();
                console.error(err);
                this.utilsService.presentToastLanguage('ENCUESTA_REALIZADA_TS.SERVER_ERROR');
              });
          } else {
            this.dismiss();
          }
        }, (err) => {
          this.dismiss();
          console.error(err);
          this.utilsService.presentToastLanguage('ENCUESTA_REALIZADA_TS.SERVER_ERROR');
        });
    });
  }

  loadData(event) {
    const max = this.offset + myInitObject.encuestasRealizadas.limit;
    this.apiService.listEncuestasUserWithEventosLimit(myInitObject.encuestasRealizadas.limit, this.offset,
      this.userId)
      .subscribe((res) => {
        if (res && !res.status && res.length > 0) {
          for (const encuesta of res) {
            if (encuesta.Eventos.imagen) {
              if (encuesta.Eventos.imagen.indexOf('data:imagen/')) {
                encuesta.imgUrl = encuesta.Eventos.imagen;
              } else {
                encuesta.imgUrl = myInitObject.apiUrl + 'image/' + encuesta.Eventos.imagen;
              }
            }
            this.encuestasScroll.push(encuesta);
          }
          this.offset = this.encuestasScroll.length;
          event.target.complete();
          if (this.encuestasScroll.length < max) {
            event.target.disabled = true;
          }
        } else {
          event.target.disabled = true;
        }
      }, (err) => {
        console.error(err);
        this.utilsService.presentToastLanguage('ENCUESTA_REALIZADA_TS.SERVER_ERROR');
      });
  }

  globalResults() {
    this.navController.navigateRoot('/app/home/resultados-globales');
  }

  openUrl(url: string) {
    this.platform.ready().then(() => {
      const browser = this.iab.create(url, '_system');
    });
  }

  evaluateEvent(id) {
    this.navController.navigateRoot('/app/home/encuesta/' + id);
  }

  showResultsEvent(id) {
    this.navController.navigateRoot('/app/resultado-encuesta/' + id);
  }


  dismiss() {
    this.loaded = true;
    return this.utilsService.dismiss();
  }

}
