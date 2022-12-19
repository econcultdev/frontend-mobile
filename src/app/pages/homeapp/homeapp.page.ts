import { myInitObject } from '../../config/config';
import { AfterContentChecked, AfterViewInit, Component, ElementRef, EventEmitter, NgZone, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AlertController, IonSlides, LoadingController, ModalController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ApiService } from 'src/app/services/api.service';
import { UtilsService } from 'src/app/services/utils.service';

import { Platform, NavController } from '@ionic/angular';

import { IonInfiniteScroll } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { TranslateConfigService } from 'src/app/services/translate-config.service';
import { AuthService } from 'src/app/services/auth.service';
import { GoogleLoginService } from 'src/app/services/google-login.service';

import { CalendarMode, Step } from 'ionic2-calendar/calendar';

import { registerLocaleData } from '@angular/common';
import localeZh from '@angular/common/locales/zh';
registerLocaleData(localeZh);

import SwiperCore, { EffectFade, SwiperOptions } from 'swiper';
import { SearchModalPopupComponent } from 'src/app/components/search-modal-popup/search-modal-popup.component';
import { DateRangeComponent } from 'src/app/components/date-range/date-range.component';
import { timestamp } from 'rxjs/operators';
import { Router } from '@angular/router';

import { SwiperComponent } from "swiper/angular";




import { CityLocationComponent } from '../../components/city-location/city-location.component';
import { ButtonBackArrowComponent } from 'src/app/components/button-back-arrow/button-back-arrow.component';
SwiperCore.use([EffectFade]);

@Component({
  selector: 'app-homeapp',
  templateUrl: './homeapp.page.html',
  styleUrls: ['./homeapp.page.scss'],

  //template:`<app-date-range [filterSelectI]="filterDateApplication"></app-date-range>`
})
export class HomeappPage implements OnInit, AfterContentChecked, OnDestroy { //}, AfterViewInit {
  //@ViewChild('swiper', { static: false }) swiper?: SwiperComponent;

  @ViewChild('CityLocationComponent', { static: true }) CityLocationComponent?: CityLocationComponent;


  config: SwiperOptions = {
    spaceBetween: 0,
    width: 100,
    height: 75,
    loop: false,
    navigation: true,
    //pagination: { clickable: true },
  };


  dew = 0;
  days = { 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6, 'Sunday': 7 };
  weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  //days = { 1: 'Monday', 2:'Tuesday', 3:'Wednesday', 4:'Thursday',5: 'Friday', 6:'Saturday', 7:'Sunday' };

  get_day() {
    const d = new Date();
    let day = this.weekday[d.getUTCDay()];
    return this.days[day];
  }
  //#endregion

  dateFilter: any;
  minDate = new Date();
  maxDate = new Date(this.minDate.getFullYear() + 1, this.minDate.getMonth(), this.minDate.getDay());

  filterSearch = '';
  startDate: Date;
  isWeb = false;
  public date: any = new Date().toISOString();
  filterDateApplicationj: Date;
  filterDateApplication = new EventEmitter<Date>();


  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;
  sliderOne: any;
  sliderTwo: any;
  sliderThree: any;
  eventosSearch: any[] = [];
  eventos: any[] = [];
  eventos_plus: any[] = [];
  offset = myInitObject.eventosDestacados.offset;
  userId = parseInt(sessionStorage.getItem('userId'), 10);
  option_filter_date = '';

  userName = '';
  photoProfileUser;
  loaded = false;
  private _language;
  private _translateServiceSubscription: Subscription;
  verifylogin = false;
  tipoeventos: any[] = [];
  date_start_consult: Date = new Date();
  date_end_consult: Date = new Date();
  date_start_consult_new: Date;
  date_end_consult_new: Date;
  selectTipoeventos: '';
  cityIdChild: any;
  cityNameChild = '';

  constructor(private apiService: ApiService,
    private authService: AuthService,
    private utilsService: UtilsService,
    private platform: Platform,
    private iab: InAppBrowser,
    private navController: NavController,
    private ngZone: NgZone,
    private translateConfigService: TranslateConfigService,
    private googleLoginService: GoogleLoginService,
    public loadingController: LoadingController,
    public alertCtrl: AlertController,
    public modalController: ModalController,
    private router: Router,

  ) {
  }
  //EVENTOS
  private _chargeDataPage() {
    this.userId = parseInt(sessionStorage.getItem('userId'), 10);
    this.eventos = [];
    this.offset = 0;
    this.loaded = false;
    if (this.date_start_consult != this.date_start_consult_new && this.date_end_consult != this.date_end_consult_new) {
      this.searchEvents(null, null, this.date_start_consult, this.date_end_consult);
    }
  }

  ngOnInit(): void {
    if (this.get_day() == 7) {
      const element1 = document.getElementById('button_this_week');
      element1.setAttribute('style', 'display:none');
    }
    if (sessionStorage.getItem('option_filter_date')) {
      this.option_filter_date = sessionStorage.getItem('option_filter_date');
    } else {
      sessionStorage.setItem('option_filter_date', "filter_today");
    }
    this.dateFilter = new Date();
    if (this.tipoeventos.length == 0)
      this.apiService.getTipoEventos().subscribe(tipoEventos => this.tipoeventos = tipoEventos ? tipoEventos : []);
    this.isWeb = this.platform.is('desktop');

    this.translateConfigService.translateVariables('EVENT_SEARCH_HTML').subscribe((res: string) => {
      this.filterSearch = res['BUTTON_TODAY_MESSAGE'];
    });

    this.loadData(this.eventosSearch);
    this.loadDataEventosPlus();
    this.ngZone.run(() => {
      if (this.userId) {
        this._chargeDataPage();
      }
    });
    this.userName = sessionStorage.getItem('name');
    if (this.authService.whoAmI()) {
      this.verifylogin = true;
    } else {
      this.verifylogin = false;
    }
  }

  ionViewWillLeave() {
    return this.utilsService.dismiss();
  }


  ionViewWillEnter() {
  }

  change_today() {
    const element1 = document.getElementById('button_today');
    element1.classList.add("active");
    const element2 = document.getElementById('button_this_week');
    element2.classList.remove("active");
    const element3 = document.getElementById('button_next_week');
    element3.classList.remove("active");
    sessionStorage.setItem('option_filter_date', "filter_today");
    this.date_start_consult = new Date;
    this.date_end_consult = new Date;
    this.loadData(this.eventos);
  }

  change_this_week() {
    const element1 = document.getElementById('button_today');
    element1.classList.remove("active");
    const element2 = document.getElementById('button_this_week');
    element2.classList.add("active");
    const element3 = document.getElementById('button_next_week');
    element3.classList.remove("active");
    sessionStorage.setItem('option_filter_date', "filter_this_week");
    this.loadData(this.eventos);
  }

  change_next_week() {
    const element1 = document.getElementById('button_today');
    element1.classList.remove("active");
    const element2 = document.getElementById('button_this_week');
    element2.classList.remove("active");
    const element3 = document.getElementById('button_next_week');
    element3.classList.add("active");
    sessionStorage.setItem('option_filter_date', "filter_next_week");
    this.loadData(this.eventos);
  }

  searchEvents(max?: any, event?: any, date_start?: Date, date_end?: Date) {
    this.apiService.getListaEventos(myInitObject.eventosDestacados.limit, myInitObject.eventosDestacados.offset, date_start, date_end).subscribe(items => {
      this.eventosSearch = items ? items : [];
      this.eventos = items ? items : [];
    });
    this.date_start_consult_new = date_start;
    this.date_end_consult_new = date_end;

  }

  proccessEventsResults(res: any, max?: any, event?: any) {
    this.eventosSearch = [];
    this.eventos = [];
    this._translateServiceSubscription = this.translateConfigService.language.subscribe(language => {
      this._language = language;
    });
    if (res && !res.status && res.length > 0) {
      for (const evento of res) {
        evento.evaluate = false;
        if (evento.imagen) {
          evento.imgUrl = evento.imagen;
        }
        if (!this.eventos.find(ev => ev.id === evento.id)) {
          this.eventos.push(evento);
          this.eventosSearch.push(evento);
        }
      }
      /*
      this.offset = this.eventos.length;
      if (max) {
        event.target.complete();
      }
      if (max && this.eventos.length < max) {
        event.target.disabled = true;
      }*/
      this.dismiss();
    } else {
      /*
      if (max) {
        event.target.disabled = true;
      }*/
      this.dismiss();
    }
  }

  /*
    checkAuthenticated(request, response, next) {
      if (this.authService.whoAmI()) {
        request.isauthenticated
        return response.redirectTo('/login');
      }
      next();
    }*/

  loadData(event) {
    this.eventosSearch = [];
    const max = this.offset + myInitObject.eventosDestacados.limit;
    if (sessionStorage.getItem('option_filter_date') == 'filter_today') {
      this.date_start_consult = new Date;
      this.date_end_consult = new Date;
      this.searchEvents(max, event, this.date_start_consult, this.date_end_consult);
    }
    if (sessionStorage.getItem('option_filter_date') == 'filter_this_week') {
      this.date_start_consult = new Date;
      this.dew = 7 - this.get_day();
      this.date_end_consult.setDate(this.date_start_consult.getDate() + this.dew);
      this.searchEvents(max, event, this.date_start_consult, this.date_end_consult);
    }
    if (sessionStorage.getItem('option_filter_date') == 'filter_next_week') {
      this.date_start_consult = new Date;
      this.date_end_consult = new Date;
      let date = new Date;
      let daystart = (7 - this.get_day() + 1);
      let dayend = (7 - this.get_day() + 7);
      this.date_start_consult.setDate(date.getDate() + daystart);
      this.date_end_consult.setDate(date.getDate() + dayend);
      this.searchEvents(max, event, this.date_start_consult, this.date_end_consult);
    }
  }
  loadDataEventosPlus() {
    this.apiService.getListaEventos_plus(myInitObject.eventosDestacados_plus.limit, myInitObject.eventosDestacados_plus.offset)
      .subscribe((res) => {
        this.eventos_plus = res;
      }, (err) => {
        this.dismiss();
        console.error(err);
        this.utilsService.presentToastLanguage('EVENTOS_DESTACADOS_TS.SERVER_ERROR');
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


  /**
   * Change attributes when change language
   */
  changeAttributesByLanguage(singleValue, multiLanguageValue) {
    return this.utilsService.changeAttributesByLanguage(singleValue, multiLanguageValue);
  }

  ngOnDestroy() {
    if (this._translateServiceSubscription) {
      this._translateServiceSubscription.unsubscribe();
    }
  }

  Filter: string;
  //err=true;
  async changeTypeEvent(value: number) {
    try {
      const val = sessionStorage.getItem('filter_category_old');
      if (val) {
        sessionStorage.setItem('filter_category_old', val.toString());
        const element1 = document.getElementById(val.toString());
        element1.setAttribute('style', 'background-color:#122B26;');

        sessionStorage.setItem('filter_category_old', value.toString());
        const element2 = document.getElementById(value.toString());
        element2.setAttribute('style', 'background-color:#3ED6C0;');


      }
      else {
        sessionStorage.setItem('filter_category_old', value.toString());
        const element2 = document.getElementById(value.toString());
        element2.setAttribute('style', 'background-color:#3ED6C0');
      }
      if (this.eventos.length > 0) {
        if (val != null && val === value.toString()) {
          const element1 = document.getElementById(val.toString());
          element1.setAttribute('style', 'background-color:#122B26;');
          this.eventosSearch = [];
          this.loadData(this.eventos);
          //sessionStorage.re('filter_category_old', null);
        }
        else {
          this.eventosSearch = [];
          let searrow = this.eventos.find(ev => ev.TipoEventoId === value);
          if (searrow != null) {
            this.eventosSearch.push(searrow);
          }
          else {
            this.eventosSearch = [];
            /*
            let alert = await this.alertCtrl.create({
              message: 'No se han encontrado resultados',
            });
            alert.present();*/
          }
        }

      }
    }
    catch (err) {
      /*
      if (this.eventosSearch != null) {
        this.eventosSearch = [];
        let alert = await this.alertCtrl.create({
          message: 'No se ha encontrado resultados',
          buttons: ['OK']
        });
        alert.present();
      }
      */

    }

  }

  ngAfterContentChecked() {
    /*
    this.config = {
      slidesPerView: 4
    };*/
  }

  goSearchExplorer() {
    this.router.navigateByUrl('event-search');
  }
  eventSource;
  loadEvents() {
    this.eventSource = [];
  }

  changeDateFilter(obj) {
    this.eventos = [];
    this.eventosSearch = [];
    this.date_start_consult = obj;
    this.loadData(this.eventos);
    //this.eventosSearch= [];
  }
  goSearchApp() {
    this.router.navigateByUrl('/event-search');
  }
}

'use strict';

