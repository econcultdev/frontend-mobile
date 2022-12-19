import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { TranslateConfigService } from 'src/app/services/translate-config.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-search',
  templateUrl: './event-search.page.html',
  styleUrls: ['./event-search.page.scss'],
})
export class EventSearchPage implements OnInit {

  dateFilter: any;;
  minDate = new Date();
  maxDate = new Date(this.minDate.getFullYear()+1, this.minDate.getMonth(), this.minDate.getDay());
  
  private _translateServiceSubscription: Subscription;
  constructor(
    private utilsService: UtilsService,
    private apiService: ApiService,
    public router: Router,

  ) { 
    
  }
  changeAttributesByLanguage(singleValue, multiLanguageValue) {
    return this.utilsService.changeAttributesByLanguage(singleValue, multiLanguageValue);
  }

  ngOnInit() {
    this.dateFilter = new Date();
  }

  changerDateFilter(obj)
  {
    this.dateFilter=obj
  }
  ionViewDidLeave() {
    return this.utilsService.dismiss();
  }

  dismiss() {
    return this.utilsService.dismiss();
  }

  ngOnDestroy() {
    if (this._translateServiceSubscription) {
      this._translateServiceSubscription.unsubscribe();
    }
  }

  goHome() {
    this.router.navigateByUrl('/');
  }


  

}
