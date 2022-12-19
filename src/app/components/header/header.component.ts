import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilsService } from 'src/app/services/utils.service';
import { MenuController, NavController, Platform, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';

import { myInitObject } from '../../config/config';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { LanguagesModalComponent } from '../languages-modal/languages-modal.component';
import { TranslateConfigService } from 'src/app/services/translate-config.service';
import { Language } from 'src/app/models/language';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('showSearchbar', [
      state('show', style({
        opacity: 1
      })),
      state('hide', style({
        opacity: 0
      })),
      transition('show => hide', animate('250ms ease-out')),
      transition('hide => show', animate('250ms ease-in'))
    ])
  ]
})
export class HeaderComponent implements OnInit {
  isWeb=false;
  query = '';
  searching = false;
  showSearchbar = false;
  private _queryStr = '';
  popover: HTMLIonPopoverElement;
  public photoProfileUser;
  @Input() verifylogin = false;
  set queryStr(query: string) {
    this._queryStr = (query && query.trim());
    if (this._queryStr) {
      this.query = this._queryStr;
    }
  }

  get queryStr(): string { return this._queryStr; }

  languages: Language[];
  language: any;

  constructor(
    private authService: AuthService,
    private menu: MenuController,
    private platform: Platform,
    private apiService: ApiService,
    private utilsService: UtilsService,
    private navController: NavController,
    private popoverController: PopoverController,
    private router: Router,
    private translateConfigService: TranslateConfigService,
    ) { }

  ngOnInit() {
    this.languages = this.translateConfigService.getAllLanguages();
    this.language = this.languages.find(lang => lang.iso === this.translateConfigService.getDefaultLanguage());
    this.translateConfigService.language.subscribe(res => {
      if (res && res != null) {
        this.language = this.languages.find(lang => lang.iso === res);
      }
    });
    this.isWeb = this.platform.is('desktop');
  }

  search() {
    this.searching = true;
    console.log(this.query);
    if (this.query) {
      let userId = parseInt(sessionStorage.getItem('userId'), 10);
      this.apiService.buscarEventos(myInitObject.eventosDestacados.limit, 0, this.query, userId)
        .subscribe((res) => {
          if (res && !res.status) {
            this.searching = false;
            sessionStorage.setItem('query_buscador', this.query);
            sessionStorage.setItem('resultados_buscador', JSON.stringify(res));
            this.navController.navigateRoot(['/app/home/resultados-busqueda/' + this.query]);
          } else {
            this.searching = false;
            this.utilsService.presentToastLanguage('HEADER_TS.SERVER_ERROR');
          }
        }, (err) => {
          this.searching = false;
          console.error(err);
          this.utilsService.presentToastLanguage('HEADER_TS.SERVER_ERROR');
        });
    } else {
      this.searching = false;
    }
  }

  ionViewWillEnter() {
    this.showSearchbar = false;
    this.photoProfileUser = sessionStorage.getItem('imagen');
  }

  get stateName() {
    return this.showSearchbar ? 'show' : 'hide'
  }

  goHome() {
    console.debug('goHome');
    this.router.navigate(['app/home/eventos-destacados']);
  }

  toggle() {
    this.showSearchbar = !this.showSearchbar;
  }

  async showLanguage(ev) {
    this.popover = await this.popoverController.create({
      component: LanguagesModalComponent,
      backdropDismiss: true,
      showBackdrop: true,
      event: ev,
      componentProps: {
        onClick: () => {
          this.popover.dismiss();
        },
      },
    });
    this.translateConfigService.setPopover(this.popover);
    return await this.popover.present();

  }



  //Dropdown Menu

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }


  logout() {
    sessionStorage.setItem('logout', '1');
    this.authService.logout().subscribe(() => {
      this.router.navigateByUrl('/');
    });
  }
  

}
