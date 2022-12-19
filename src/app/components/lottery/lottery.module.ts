import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { LotteryComponent } from './lottery.component';
import { LottieModule } from 'ngx-lottie';
import { LottieAnimationViewComponentModule } from '../lottie-animation-view/lottie-animation-view.module';

const routes: Routes = [
  {
    path: '',
    component: LotteryComponent
  }
];

@NgModule({
  declarations: [LotteryComponent],
  imports: [
    CommonModule,
    TranslateModule,
    IonicModule,
    LottieModule,
    LottieAnimationViewComponentModule
  ],
  exports: [LotteryComponent]
})

export class LotteryModule { }
