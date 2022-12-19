import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { LottieModule } from 'ngx-lottie';
import { LottieAnimationViewComponent } from './lottie-animation-view.component';

const routes: Routes = [
  {
    path: '',
    component: LottieAnimationViewComponent
  }
];

@NgModule({
  declarations: [LottieAnimationViewComponent],
  imports: [
    CommonModule,
    TranslateModule,
    IonicModule,
    LottieModule,
  ],
  exports: [LottieAnimationViewComponent]
})

export class LottieAnimationViewComponentModule { }
