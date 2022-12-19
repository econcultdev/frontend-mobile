import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EditarUsuarioPage } from './editar-usuario.page';
import { PasswordStrengthBarModule } from 'ng2-password-strength-bar';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

import { TranslateModule } from '@ngx-translate/core';
import { ProfilePhotoOptionComponent } from 'src/app/components/profile-photo-option/profile-photo-option.component';

const routes: Routes = [
  {
    path: '',
    component: EditarUsuarioPage
  }
];

@NgModule({
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PasswordStrengthBarModule,
    RouterModule.forChild(routes),
    SharedComponentsModule,
  ],
  
  declarations: [EditarUsuarioPage, ProfilePhotoOptionComponent],
  entryComponents: [ProfilePhotoOptionComponent],

})
export class EditarUsuarioPageModule { }

