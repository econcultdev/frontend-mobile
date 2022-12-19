import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GoogleLoginPageModule } from '../../components/google-login/google-login.module'
import { LoginPage } from './login.page';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonMultilanguageModule } from '../../components/button-multilanguage/button-multilanguage.module';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  }
];

@NgModule({
  imports: [
    SharedComponentsModule,
    CommonModule,
    TranslateModule,
    ButtonMultilanguageModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    GoogleLoginPageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LoginPage],
  providers: [Keyboard]
})
export class LoginPageModule { }
