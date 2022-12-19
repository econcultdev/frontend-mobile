//import { Component, OnInit } from '@angular/core';
import { Component, NgZone, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, Platform, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateConfigService } from 'src/app/services/translate-config.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Evento } from '../../models/evento';

import { myInitObject } from '../../config/config';
import { IonSlides } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


import { IonInfiniteScroll } from '@ionic/angular';
import { GoogleLoginService } from 'src/app/services/google-login.service';

import { DomSanitizer } from '@angular/platform-browser';
//import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
//import * as Leaflet from 'leaflet';
import * as L from 'leaflet';




@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit, OnDestroy, AfterViewInit {
  public load: boolean;

  verifylogin = false;
  eventId;
  userId = parseInt(sessionStorage.getItem('userId'), 10);
  //evento=ApiService;
  idEncuentraEvento = 0;
  public savedEvent: boolean;
  userphoto = 'src/assets/user-photo.jpg';
  latitud = 0;
  longitud = 0;
  zoom = 17;
  srcmap = "";
  urlmap;

  loaded = false;
  nombre = '';
  fecha_inicio = Date.now;
  fecha_fin = Date.now;
  hora = "";
  direccion = "";
  public evento = null;
  private _language;
  eventoSuscriber: Subscription;
  private _translateServiceSubscription: Subscription;
  //evento: Eventoapp;
  eventos: any[] = [];
  EventLikeUser: any[] = [];
  list_schedule: any[] = [];
  list_opinions: any[] = [];
  imagen = [null];
  pet: string;

  constructor(
    //private socialSharing: SocialSharing,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertCtrl: AlertController,
    private navController: NavController,
    private apiService: ApiService,
    private authService: AuthService,
    private utilsService: UtilsService,
    private platform: Platform,
    //private iab: InAppBrowser,
    //private navController: NavController,
    private ngZone: NgZone,
    private translateConfigService: TranslateConfigService,
    private googleLoginService: GoogleLoginService,
    private sanitize: DomSanitizer,

  ) {
    this.load = false;
  }

  getUrl() {
    return "url('https://i.pravatar.cc/150')";
  }
  ngOnInit() {
    this._translateServiceSubscription = this.translateConfigService.language.subscribe(language => {
      this._language = language;
    });
    if (this.authService.whoAmI()) {
      this.verifylogin = true;
    } else {
      this.verifylogin = false;
    }
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("eventId")) {
        // redirect
        this.router.navigate(['/homeapp']);
      }
      this.userId = parseInt(sessionStorage.getItem('userId'), 10);
      this.eventId = paramMap.get("eventId");
      this.evento = null;
      this.apiService.getEvento(parseInt(this.eventId))
        .subscribe(data => {
          this.evento = data;
          this.nombre = this.evento.nombre;
          if (this.evento.Business) {
            this.latitud = this.evento.Business.latitud;
            this.longitud = this.evento.Business.longitud;
            console.log(this.latitud + "  ----  " + this.longitud);
            //this.leafletMap();
          }
          if (data.Encuestas.length) {
            data.Encuestas[0].id;
          }
        }, (err) => {
          console.error(err);
          this.utilsService.presentToastLanguage('DASHBOARD_TS.SERVER_ERROR');
        });
      if (this.userId) {
        this.getEventSavedUser(parseInt(this.eventId), this.userId);
      }
      this.getEventSchedule(this.eventId);
      this.eventOpinionsLoading(parseInt(this.eventId));
    });

    //this.leafletMap();
   
  }




  ngAfterViewInit(): void {


  }

  ionViewDidEnter() {
    //this.leafletMap();
    if (this.map) {
      //to remove any initialization of a previous map
      this.map.off();
      this.map.remove();
    }
    
    setTimeout(() => {
      this.load = true;
      if  (this.map== undefined){
        // tiles are used to load and display tile layers on the map.
        var originalTile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 });
        // declaring the leaflet map
        this.map = new L.Map('map', {
          //choose the default view coordinates
          center: [this.latitud, this.longitud],
          //choose the zooming level
          zoom: 17,
          //to remove the attribution
          attributionControl: false,
          //to add predefined layers
          layers: originalTile
  
        });
  
        var myIcon = L.icon({
  
          iconUrl: 'assets/leaflet/icon-location.png',
          iconSize: [30, 50],
          iconAnchor: [0, 0],
          popupAnchor: [10, 0],
          shadowUrl: '',
          shadowSize: [0, 0],
          shadowAnchor: [0, 0]
        });
        L.marker([this.latitud, this.longitud], { icon: myIcon }).addTo(this.map).bindPopup(
          '<h5>' + this.nombre + '</h5>'
        ).openPopup();
      }
    }, 3000);   
  }

  async eventLoading(eventId) {
    const loader = await this.apiService.getEvento(eventId)
      .subscribe((res) => {
        this.proccessEventsResults(res);
      }, (err) => {
        this.dismiss();
        console.error(err);
        this.utilsService.presentToastLanguage('EVENTOS_DESTACADOS_TS.SERVER_ERROR');
      });
  }

  async getEventSavedUser(eventId, userId) {
    let ss = this.apiService.getEventSavedUser(eventId, userId)
      .subscribe((res) => {
        this.savedEvent = res.saved;

      }, (err) => {
        this.dismiss();
        console.error(err);
        this.utilsService.presentToastLanguage('EVENTOS_DESTACADOS_TS.SERVER_ERROR');
      });
  }

  async getEventSchedule(eventId) {
    this.apiService.getEventSchedule(eventId)
      .subscribe((res) => {
        this.list_schedule = res;
      }, (err) => {
        this.dismiss();
        console.error(err);
        this.utilsService.presentToastLanguage('EVENTOS_DESTACADOS_TS.SERVER_ERROR');
      });
  }

  async eventOpinionsLoading(eventId) {
    this.apiService.getEventOpinions(eventId)
      .subscribe((res) => {
        this.list_opinions = res;
      }, (err) => {
        this.dismiss();
        console.error(err);
        this.utilsService.presentToastLanguage('EVENTOS_DESTACADOS_TS.SERVER_ERROR');
      });
  }

  proccessEventsResults(res: any, max?: any, event?: any) {
    this._translateServiceSubscription = this.translateConfigService.language.subscribe(language => {
      this._language = language;
    });
    if (res && !res.status && res.length > 0) {
      for (const evento of res) {
        evento.evaluate = false;
        if (evento.Encuestas && evento.Encuestas && Array.isArray(evento.Encuestas) && evento.Encuestas.length > 0) {
          let lEventDateStart = new Date(evento.fecha_inicio);
          let lSurveyDateFinish = new Date(evento.Encuestas[0].fecha_cierre_encuesta);
          let lDateNow = Date.now();
          if (lEventDateStart.getTime() <= lDateNow && lDateNow <= lSurveyDateFinish.getTime()) {
            evento.evaluate = true;
          }
        }
        if (evento.imagen) {
          evento.imgUrl = evento.imagen;
        }
        if (!this.eventos.find(ev => ev.id === evento.id)) {
          this.eventos.push(evento);
        }
      }
      //this.leafletMap();
    }
  }

  /**
   * It is used to open a window with the legal text depending on who invokes it
   * @param action Button action: 'register' | 'google'
   * @param privacyText Name of text legal variable: 'dataPrivacyText' : 'legalConditionsText'
   */
  async googleLogin() {
    this.googleLoginService.googleLogin();
  }

  ngOnDestroy() {
    if (this.eventoSuscriber) {
      this.eventoSuscriber.unsubscribe();
    }
    if (this._translateServiceSubscription) {
      this._translateServiceSubscription.unsubscribe();
    }
    this.map.remove();
  }

  dismiss() {
    this.loaded = true;
    return this.utilsService.dismiss();
  }

  changeAttributesByLanguage(singleValue, multiLanguageValue) {
    return this.utilsService.changeAttributesByLanguage(singleValue, multiLanguageValue);
  }

  checkAuthenticated(request, response, next) {
    if (this.authService.whoAmI()) {
      request.isauthenticated
      return response.redirectTo('/login');
    }
    next();
  }

  public changeLike(value: boolean) {
    try {
      if (this.authService.whoAmI()) {
        this.verifylogin = true;
      } else {
        this.verifylogin =  false;
      }
      
      this.savedEvent = value;

      let obj = { EventoId: this.evento.id, UserId: this.userId, saved: this.savedEvent };
      this.apiService.setEventSavedUser(obj).subscribe(_ => {
        this.dismiss().then(() => {
        });
      }, (err) => {
        this.dismiss();
        console.log(err);
        this.utilsService.presentToast('Error al comunicarse con el servidor', 3000, '-danger');
      });
    }
    catch (error) {
      console.error(error);
    }
  }



  evaluateEvent(id) {
    if (this.verifylogin) {
      this.navController.navigateRoot('/app/encuesta/' + id);
    } else {
      sessionStorage.setItem('encuestaid', id);
      this.navController.navigateRoot('/login');
    }
  }
  //map: Leaflet.Map;
  map: L.ap;

  leafletMap() {
    //console.log(this.map);

    const container = new L.map('mapid').setView([this.latitud, this.longitud], 3);
    if (container) {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Aucultura',
      }).addTo(this.map);
      L.marker([this.latitud, this.longitud]).addTo(this.map).bindPopup(
        '<h5>' + this.nombre + '</h5>'
      ).openPopup();
    }




    //antPath([[39.4774983, -0.3484146], [42.4774983, -0.3484146]],{ color: '#FF0000', weight: 5, opacity: 0.6 }).addTo(this.map);
  }
  ionViewDidLoad() {

  }



  private dd(): void {
    var marker = L.marker([50.4501, 30.5234],
      { alt: 'Kyiv' }).addTo(this.map) // "Kyiv" is the accessible name of this marker
      .bindPopup('Kyiv, Ukraine is the birthplace of Leaflet!');
  }
  private initMap(): void {
    this.map = L.map('map', {
      center: [39.8282, -98.5795],
      zoom: 3
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  public setHideReviewUser(data) {
    try {
      let obj = {
        encuestaId: data.EncuestaId,
        preguntaId: data.EncuestaPreguntaId,
        userId: data.UserId
      };
      this.apiService.setHideReviewUser(obj).subscribe(_ => {
        this.dismiss().then(() => {
          this.eventOpinionsLoading(parseInt(this.eventId));
        });
      }, (err) => {
        this.dismiss();
        console.log(err);
        this.utilsService.presentToast('Error al comunicarse con el servidor', 3000, '-danger');
      });
    }
    catch (error) {
      console.error(error);
    }
  }

  showHideReviewUser(data) {
    this.alertCtrl.create({
      subHeader: 'Esta seguro de desea ocultar?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {

          }
        },
        {
          text: 'Done!',
          handler: () => {
            if (data) {
              this.setHideReviewUser(data);
            }
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }

}
