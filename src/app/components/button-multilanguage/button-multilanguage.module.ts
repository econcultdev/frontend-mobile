import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonMultilanguageComponent } from './button-multilanguage.component';

const routes: Routes = [
  {
    path: '',
    component: ButtonMultilanguageComponent
  }
];

@NgModule({
  declarations: [ButtonMultilanguageComponent],
  imports: [
    CommonModule,
    TranslateModule,
    IonicModule
  ],
  exports: [ButtonMultilanguageComponent]
})

export class ButtonMultilanguageModule { }
