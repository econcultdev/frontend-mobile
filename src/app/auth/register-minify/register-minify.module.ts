import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RegisterMinifyPage } from './register-minify.page';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonMultilanguageModule } from 'src/app/components/button-multilanguage/button-multilanguage.module';
import { PasswordStrengthBarModule } from 'ng2-password-strength-bar';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

const routes: Routes = [
  {
    path: '',
    component: RegisterMinifyPage
  }
];

@NgModule({
  imports: [
    SharedComponentsModule,
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
    RegisterMinifyPage
  ]
})
export class RegisterMinifyPageModule { }
