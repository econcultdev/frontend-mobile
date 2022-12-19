import { Injectable, OnDestroy } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { TranslateConfigService } from './translate-config.service';

@Injectable({
  providedIn: 'root'
})
export class UtilsService implements OnDestroy {

  currentLoading = null;
  private _translateMessage: string = 'Por favor espere...';

  private _slidesShow = null;
  private _slidesShow$ = new BehaviorSubject(this._slidesShow);

  set slidesShow(value: any) {
    sessionStorage.setItem('showSlides', value);
    this._slidesShow = value;
    this._slidesShow$.next(sessionStorage.getItem('showSlides'));
  }
  get slidesShow() {
    this._slidesShow$.next(sessionStorage.getItem('showSlides'));
    return this._slidesShow$.asObservable();
  }
  private _translateServiceSubscription: Subscription;
  private _language;
  private _modal: HTMLIonModalElement;

  constructor(
    public loadingController: LoadingController,
    public toastController: ToastController,
    public translateConfigService: TranslateConfigService) {
    this.translateConfigService.language.subscribe(() => {
      this.translateLanguage('UTILS_SERVICE_TS.PLEASE_WAIT').subscribe(res => {
        this._translateMessage = res;
      });
    });
    this._translateServiceSubscription = this.translateConfigService.language.subscribe(language => {
      this._language = language;
    });
  }

  ngOnDestroy() {
    if (this._translateServiceSubscription) {
      this._translateServiceSubscription.unsubscribe();
    }
  }


  async presentLoadingWithOptions() {
    try {
      await this.dismiss();
      const loader = await this.loadingController.create({
        spinner: 'circular',
        message: this._translateMessage,
        translucent: true
      });
      return loader.present();
    } catch (err) {
      console.error(err);
      return Promise.resolve();
    }
  }

  async dismiss() {
    while (await this.loadingController.getTop() !== undefined) {
      await this.loadingController.dismiss();
    }
  }

  async presentToast(msg: string, duration = 2000, suffixClass = '') {
    const toast = await this.toastController.create({
      message: msg,
      duration,
      position: 'top',
      cssClass: 'toast-container' + suffixClass
    });
    toast.present();
  }

  /**
   * It is used to present an alert with the translation of the language that the application has
   * @param translation Variable
   * @param params Parameters, ex: { username: name }
   */
  presentToastLanguage(translation: string, params?: any) {
    if (!params) {
      this.translateLanguage(translation).subscribe(res => {
        if (res && res != null) {
          this.presentToast(res, 3000, '-danger');
        }
      });
    } else {
      this.translateLanguage(translation, params).subscribe(res => {
        if (res && res != null) {
          this.presentToast(res, 3000, '-danger');
        }
      });
    }
  }

  /**
   * It is used to find the translation of the variable with the parameters
   * @param translation Variables
   * @param params Parameters, ex: { username: name}
   */
  translateLanguage(translation: string, params?: any): Observable<any> {
    if (params != undefined) {
      return this.translateConfigService.translateVariables(translation, params);
    } else {
      return this.translateConfigService.translateVariables(translation);
    }
  }

  /**
   * Change attributes when change language
   */
  changeAttributesByLanguage(singleValue, multiLanguageValue) {
    if (singleValue && multiLanguageValue) {
      return this.changeAttributeByLanguage(singleValue, multiLanguageValue);
    }
    return singleValue;
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

  closeSlidesStart() {
    this.slidesShow = false;
  }

  setModal(modal: HTMLIonModalElement) {
    this._modal = modal;
  }

  dismissModal() {
    if (this._modal) {
      this._modal.dismiss();
    }
  }

}
