import { Component, Input, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateConfigService } from 'src/app/services/translate-config.service';
import { UtilsService } from 'src/app/services/utils.service';

import * as Leaflet from 'leaflet';
import { antPath } from 'leaflet-ant-path';



@Component({
  selector: 'app-search-events',
  templateUrl: './search-events.page.html',
  styleUrls: ['./search-events.page.scss'],
})
export class SearchEventsPage implements OnInit {

  verifylogin = false;
  constructor(
    private authService: AuthService,
    private platform: Platform,
    private translateConfigService: TranslateConfigService,
    private utilsService: UtilsService) { }

  changeAttributesByLanguage(singleValue, multiLanguageValue) {
    return this.utilsService.changeAttributesByLanguage(singleValue, multiLanguageValue);
  }
  ngOnInit() {
    
  }

  

  

  ionViewWillEnter() {
    
    if (this.authService.whoAmI()) {
      this.verifylogin = true;
    } else {
      this.verifylogin = false;
    }
  }

  ionViewDidEnter() { this.leafletMap(); }



  ///MAPPPP TEST
  map: Leaflet.Map;


  leafletMap() {
    
    //this.map = Leaflet.map('mapId').setView([39.4774983, -0.3484146], 5);
    this.map = Leaflet.map('mapaa').setView([39.4774983, -0.3484146], 15);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Aucultura',
    }).addTo(this.map);
    Leaflet.marker([39.4774983, -0.3424146]).addTo(this.map).bindPopup('Aucultura').openPopup();
    Leaflet.marker([39.4774983, -0.3484146]).addTo(this.map).bindPopup('Home').openPopup();
    Leaflet.marker([39.4804314, -0.3471048]).addTo(this.map).bindPopup('UPV').openPopup();
    //Leaflet.marker([38.4774983, -0.3584146]).bindPopup('This is Golden, CO.');

    //antPath([[39.4774983, -0.3484146], [42.4774983, -0.3484146]],{ color: '#FF0000', weight: 5, opacity: 0.6 }).addTo(this.map);
  }

  /** Remove map when we have multiple map object */
  ngOnDestroy() {
    this.map.remove();
  }

  

}
