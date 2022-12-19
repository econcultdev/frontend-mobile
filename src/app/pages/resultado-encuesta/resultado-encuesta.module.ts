import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ResultadoEncuestaPage } from './resultado-encuesta.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { TranslateModule } from '@ngx-translate/core';
import { LottieModule } from 'ngx-lottie';
import { LotteryModule } from 'src/app/components/lottery/lottery.module';
import { LotteryComponent } from 'src/app/components/lottery/lottery.component';

const routes: Routes = [
  {
    path: '',
    component: ResultadoEncuestaPage
  }
];

@NgModule({
  entryComponents: [
    LotteryComponent
  ],
  imports: [
    TranslateModule,
    CommonModule,
    LotteryModule,
    FormsModule,
    IonicModule,
    LottieModule,
    RouterModule.forChild(routes),
    SharedComponentsModule
  ],
  declarations: [ResultadoEncuestaPage]
})
export class ResultadoEncuestaPageModule { }
