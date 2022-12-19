import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { Pipes } from 'src/app/pipes/pipes.module';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { ResultadosBusquedaPage } from './resultados-busqueda.page';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: ResultadosBusquedaPage
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
  declarations: [ResultadosBusquedaPage]
})
export class ResultadosBusquedaPageModule { }
