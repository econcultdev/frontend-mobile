import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { PasswordStrengthBarModule } from 'ng2-password-strength-bar';

import { IonicModule } from '@ionic/angular';

import { ModifyPasswordPage } from './modify-password.page';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: ModifyPasswordPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PasswordStrengthBarModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ModifyPasswordPage]
})
export class ModifyPasswordPageModule { }
