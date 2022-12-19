import { Component, OnDestroy, OnInit } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ApiService } from '../../services/api.service';
import { UtilsService } from '../../services/utils.service';
import { Subscription } from 'rxjs';
import { TranslateConfigService } from 'src/app/services/translate-config.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {

  username = sessionStorage.getItem('userName');
  userId = parseInt(sessionStorage.getItem('userId'), 10);
  name = sessionStorage.getItem('name') || this.username;
  evento = null;
  private _language;
  private _translateServiceSubscription: Subscription;

  constructor(
    private apiService: ApiService,
    private utilsService: UtilsService,
    private platform: Platform,
    private iab: InAppBrowser,
    private navController: NavController,
    private translateConfigService: TranslateConfigService
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.userId = parseInt(sessionStorage.getItem('userId'), 10);
    this.username = sessionStorage.getItem('userName');
    this.name = sessionStorage.getItem('name') || this.username;
    this.evento = null;
    this.apiService.getEventoCloserByDate(this.userId)
      .subscribe((res) => {
        if (res && !res.status && res.length > 0) {
          this.evento = res[0];

          this._translateServiceSubscription = this.translateConfigService.language.subscribe(language => {
            this._language = language;
          });
        }
      }, (err) => {
        console.error(err);
        this.utilsService.presentToastLanguage('DASHBOARD_TS.SERVER_ERROR');
      });
  }

  openUrl(url: string) {
    this.platform.ready().then(() => {
      const browser = this.iab.create(url, '_system');
    });
  }


  evaluateEvent() {
    this.navController.navigateRoot(`app/home/eventos-destacados`);
  }

  consumeBonus() {

  }

  /**
   * Change attributes when change language
   */
  changeAttributesByLanguage(singleValue, multiLanguageValue) {
    return this.utilsService.changeAttributesByLanguage(singleValue, multiLanguageValue);
  }

  ngOnDestroy() {
    if (this._translateServiceSubscription) {
      this._translateServiceSubscription.unsubscribe()
    }
  }

}
