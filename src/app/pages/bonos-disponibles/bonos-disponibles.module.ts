import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BonosDisponiblesPage } from './bonos-disponibles.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: BonosDisponiblesPage
  }
];

@NgModule({
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedComponentsModule
  ],
  declarations: [BonosDisponiblesPage]
})
export class BonosDisponiblesPageModule { }
