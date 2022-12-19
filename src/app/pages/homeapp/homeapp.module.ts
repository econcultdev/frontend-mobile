import { NgModule,LOCALE_ID } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeappPageRoutingModule } from './homeapp-routing.module';

import { HomeappPage } from './homeapp.page';

import { SharedComponentsModule } from '../../components/shared-components.module';

import { Pipes } from 'src/app/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgCalendarModule  } from 'ionic2-calendar';

import { registerLocaleData } from '@angular/common';
import localeZh from '@angular/common/locales/zh';
import SwipexrCore from 'swiper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';


//SwiperCore.use([IonicModule]);


registerLocaleData(localeZh);


import { SwiperModule } from 'swiper/angular';


//import { Component, ViewEncapsulation, ViewChild } from "@angular/core";
//import { SwiperComponent } from "swiper/angular";

// import Swiper core and required modules


// install Swiper modules
/*

@Component({
  selector: "app-swiper-example",
  template: `<swiper
    [slidesPerView]="3"
    [spaceBetween]="30"
    [freeMode]="true"
    [pagination]="{
      clickable: true
    }"
    class="mySwiper"
  >
    <ng-template swiperSlide>Slide 1</ng-template
    ><ng-template swiperSlide>Slide 2</ng-template
    ><ng-template swiperSlide>Slide 3</ng-template
    ><ng-template swiperSlide>Slide 4</ng-template
    ><ng-template swiperSlide>Slide 5</ng-template
    ><ng-template swiperSlide>Slide 6</ng-template
    ><ng-template swiperSlide>Slide 7</ng-template
    ><ng-template swiperSlide>Slide 8</ng-template
    ><ng-template swiperSlide>Slide 9</ng-template>
  </swiper>`,
  styleUrls: ["./app.components.scss"],
  encapsulation: ViewEncapsulation.None,
})
*/

@NgModule({
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    IonicModule,
    HomeappPageRoutingModule,
    Pipes,
    SharedComponentsModule,
    NgCalendarModule,
    SwiperModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  declarations: [HomeappPage],
  //providers: [
  //  { provide: LOCALE_ID, useValue: 'ES' }]
})


export class HomeappPageModule {}
