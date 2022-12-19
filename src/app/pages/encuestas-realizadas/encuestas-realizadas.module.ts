import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EncuestasRealizadasPage } from './encuestas-realizadas.page';
import { Pipes } from 'src/app/pipes/pipes.module';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: EncuestasRealizadasPage
  }
];

@NgModule({
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    Pipes,
    SharedComponentsModule
  ],
  declarations: [EncuestasRealizadasPage]
})
export class EncuestasRealizadasPageModule { }