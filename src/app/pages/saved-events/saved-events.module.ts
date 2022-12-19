import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SavedEventsPageRoutingModule } from './saved-events-routing.module';

import { SavedEventsPage } from './saved-events.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    SavedEventsPageRoutingModule,
    SharedComponentsModule,
  ],
  declarations: [SavedEventsPage]
})
export class SavedEventsPageModule {}
