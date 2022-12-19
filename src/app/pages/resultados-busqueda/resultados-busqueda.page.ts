import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilsService } from 'src/app/services/utils.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Platform, NavController } from '@ionic/angular';
import { IonInfiniteScroll } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { myInitObject } from '../../config/config';

@Component({
  selector: 'app-resultados-busqueda',
  templateUrl: './resultados-busqueda.page.html',
  styleUrls: ['./resultados-busqueda.page.scss'],
})
export class ResultadosBusquedaPage implements OnInit {

  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;
  query = '';
  userId = parseInt(sessionStorage.getItem('userId'), 10);
  loaded = false;
  offset = 0;
  eventos: any[] = [];

  constructor(private apiService: ApiService,
    private utilsService: UtilsService,
    private activatedRoute: ActivatedRoute,
    private platform: Platform,
    private iab: InAppBrowser,
    private navController: NavController) { }

  ngOnInit() {
  }

  ionViewWillLeave() {
    sessionStorage.removeItem('query_buscador');
    sessionStorage.removeItem('resultados_buscador');
    return this.utilsService.dismiss();
  }

  ionViewWillEnter() {
    this.userId = parseInt(sessionStorage.getItem('userId'), 10);
    this.eventos = [];
    this.offset = 0;
    this.loaded = false;
    this.query = '';
    if (this.activatedRoute.snapshot.paramMap.get('query')) {
      this.query = this.activatedRoute.snapshot.paramMap.get('query');
    }
    if (this.query) {
      const resStorage = sessionStorage.getItem('resultados_buscador');
      if (resStorage) {
        const res = JSON.parse(resStorage);
        for (const evento of res) {
          if (evento) {
            if (evento.imagen) {
              if (evento.imagen.indexOf('data:imagen/')) {
                evento.imgUrl = evento.imagen;
              } else {
                evento.imgUrl = myInitObject.apiUrl + 'image/' + evento.imagen;
              }
            }
            this.eventos.push(evento);
          }
        }
        this.offset = this.eventos.length;
        sessionStorage.removeItem('resultados_buscador');
        this.loaded = true;
      } else {
        this.utilsService.presentLoadingWithOptions().then(() => {
          let userId = parseInt(sessionStorage.getItem('userId'), 10);
          this.apiService.buscarEventos(myInitObject.eventosDestacados.limit, this.offset, this.query, userId)
            .subscribe((res) => {
              if (res && !res.status) {
                for (const evento of res) {
                  if (evento) {
                    if (evento.imagen) {
                      if (evento.imagen.indexOf('data:imagen/')) {
                        evento.imgUrl = evento.imagen;
                      } else {
                        evento.imgUrl = myInitObject.apiUrl + 'image/' + evento.imagen;
                      }
                    }
                    this.eventos.push(evento);
                  }
                }
                this.offset = this.eventos.length;
                this.dismiss().then(() => {

                });
              } else {
                this.dismiss();
                this.utilsService.presentToastLanguage('RESULTADO_BUSQUEDA_TS.SERVER_ERROR');
              }
            }, (err) => {
              this.dismiss();
              console.error(err);
              this.utilsService.presentToastLanguage('RESULTADO_BUSQUEDA_TS.SERVER_ERROR');
            });
        });
      }
    } else {
      this.utilsService.presentToastLanguage('RESULTADO_BUSQUEDA_TS.SEARCH_NOT_ALLOWED');
    }
  }

  loadData(event) {
    if (this.offset % myInitObject.eventosDestacados.limit !== 0) {
      event.target.disabled = true;
      return;
    }
    const max = this.offset + myInitObject.eventosDestacados.limit;
    let userId = parseInt(sessionStorage.getItem('userId'), 10);
    this.apiService.buscarEventos(myInitObject.eventosDestacados.limit, this.offset, this.query, userId)
      .subscribe((res) => {
        if (res && !res.status && res.length > 0) {
          for (const evento of res) {
            if (evento) {
              if (evento.imagen) {
                if (evento.imagen.indexOf('data:imagen/')) {
                  evento.imgUrl = evento.imagen;
                } else {
                  evento.imgUrl = myInitObject.apiUrl + 'image/' + evento.imagen;
                }
              }
              this.eventos.push(evento);
            }
          }
          this.offset = this.eventos.length;
          event.target.complete();
          if (this.eventos.length < max) {
            event.target.disabled = true;
          }
        } else {
          event.target.disabled = true;
        }
      }, (err) => {
        console.error(err);
        this.utilsService.presentToastLanguage('RESULTADO_BUSQUEDA_TS.SERVER_ERROR');
      });
  }


  dismiss() {
    this.loaded = true;
    return this.utilsService.dismiss();
  }

  openUrl(url: string) {
    this.platform.ready().then(() => {
      const browser = this.iab.create(url, '_system');
    });
  }

  evaluateEvent(id) {
    this.navController.navigateRoot('/app/home/encuesta/' + id);
  }

  /**
   * Change attributes when change language
   */
  changeAttributesByLanguage(singleValue, multiLanguageValue) {
    return this.utilsService.changeAttributesByLanguage(singleValue, multiLanguageValue);
  }

}
