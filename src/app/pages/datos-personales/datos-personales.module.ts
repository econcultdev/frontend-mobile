import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { AutoCompleteModule } from 'ionic4-auto-complete';
import { DatosPersonalesPage } from './datos-personales.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: DatosPersonalesPage
  }
];

@NgModule({
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AutoCompleteModule,
    RouterModule.forChild(routes),
    SharedComponentsModule
  ],
  declarations: [DatosPersonalesPage]
})
export class DatosPersonalesPageModule { }
