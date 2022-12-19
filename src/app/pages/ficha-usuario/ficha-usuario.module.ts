import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { Pipes } from 'src/app/pipes/pipes.module';
import { FichaUsuarioPage } from './ficha-usuario.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: FichaUsuarioPage
  }
];

@NgModule({
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    IonicModule,
    Pipes,
    RouterModule.forChild(routes),
    SharedComponentsModule
  ],
  declarations: [FichaUsuarioPage]
})
export class FichaUsuarioPageModule { }
