import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListExperienceEvaluatePageRoutingModule } from './list-experience-evaluate-routing.module';

import { ListExperienceEvaluatePage } from './list-experience-evaluate.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ListExperienceEvaluatePageRoutingModule,
    SharedComponentsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  declarations: [ListExperienceEvaluatePage]
})
export class ListExperienceEvaluatePageModule {}
