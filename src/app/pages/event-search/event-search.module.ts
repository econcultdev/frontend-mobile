import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventSearchPageRoutingModule } from './event-search-routing.module';

import { EventSearchPage } from './event-search.page';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';



@NgModule({
  imports: [
    MatNativeDateModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    CommonModule,
    IonicModule,
    EventSearchPageRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    SharedComponentsModule,
  ],
  declarations: [EventSearchPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EventSearchPageModule { }
