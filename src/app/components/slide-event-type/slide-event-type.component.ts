import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilsService } from 'src/app/services/utils.service';
import SwiperCore, { EffectFade, SwiperOptions } from 'swiper';

@Component({
  selector: 'app-slide-event-type',
  templateUrl: './slide-event-type.component.html',
  styleUrls: ['./slide-event-type.component.scss'],
})
export class SlideEventTypeComponent implements OnInit {

  tipoeventos: any[] = [];
  constructor(private apiService: ApiService,
    private utilsService: UtilsService,) { }

    config: SwiperOptions = {
      spaceBetween: 1,
      width: 50,
      height: 75,
      loop: false,
      navigation: true,
      //pagination: { clickable: true },
    };

  ngOnInit() {
    if (this.tipoeventos.length == 0)
      this.apiService.getTipoEventos().subscribe(tipoEventos => this.tipoeventos = tipoEventos ? tipoEventos : []);
  }

  async changeTypeEvent(value: number) {
    try {
      /*
      if (this.eventos.length > 0) {
        this.eventosSearch = [];
        let searrow = this.eventos.find(ev => ev.TipoEventoId === value);
        if (searrow != null) {
          this.eventosSearch.push(searrow);
        }
        else {
          this.eventosSearch = [];
          
          let alert = await this.alertCtrl.create({
            message: 'No se ha encontrado resultados',
          });
          alert.present();
        }
      }
      */
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

  changeAttributesByLanguage(singleValue, multiLanguageValue) {
    return this.utilsService.changeAttributesByLanguage(singleValue, multiLanguageValue);
  }

}
