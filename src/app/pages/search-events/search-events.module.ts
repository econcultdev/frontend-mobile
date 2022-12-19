import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchEventsPageRoutingModule } from './search-events-routing.module';

import { SearchEventsPage } from './search-events.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchEventsPageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [SearchEventsPage]
})
export class SearchEventsPageModule {}
