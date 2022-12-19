import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { TranslateConfigService } from 'src/app/services/translate-config.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-saved-events',
  templateUrl: './saved-events.page.html',
  styleUrls: ['./saved-events.page.scss'],
})
export class SavedEventsPage implements OnInit {

  private _language;
  private _translateServiceSubscription: Subscription;
  loaded = false;
  eventos: any[] = [];
  userId = parseInt(sessionStorage.getItem('userId'), 10);

  constructor(private apiService: ApiService,
    private translateConfigService: TranslateConfigService,
    private utilsService: UtilsService,
    private platform: Platform,) { }

  ngOnInit() {
    
  }


  ionViewWillEnter() {
    this.loadDataEventSavedUser();
    if (this.platform.is('desktop')) {
      //this.platform.window.innerWidth;
      console.log("Platform desktop...");
    } else if 
    (this.platform.is('ios')){
      console.log("Platform ios...");
    }
    else if 
    (this.platform.is('android')){
      console.log("Platform android...");
    }
  }

  dismiss() {
    this.loaded = true;
    return this.utilsService.dismiss();
  }

  
  loadDataEventSavedUser() {

    this.apiService.getEventosSavedUserId(this.userId)
      .subscribe((res) => {
        this.proccessEventsResults(res);
      }, (err) => {
        this.dismiss();
        console.error(err);
        this.utilsService.presentToastLanguage('EVENTOS_DESTACADOS_TS.SERVER_ERROR');
      });
  }


  proccessEventsResults(res: any, max?: any, event?: any) {
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
        }
      }
    }
  }
}
