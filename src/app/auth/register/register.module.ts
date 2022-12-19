import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { PasswordStrengthBarModule } from 'ng2-password-strength-bar';

import { IonicModule } from '@ionic/angular';

import { ControlMessagesComponent } from '../../components/controlmessages/controlmessages.component';
import { RegisterPage } from './register.page';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonMultilanguageModule } from 'src/app/components/button-multilanguage/button-multilanguage.module';

const routes: Routes = [
  {
    path: '',
    component: RegisterPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonMultilanguageModule,
    PasswordStrengthBarModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    RegisterPage,
    ControlMessagesComponent
  ]
})
export class RegisterPageModule { }
