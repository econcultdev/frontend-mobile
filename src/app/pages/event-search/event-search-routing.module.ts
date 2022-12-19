import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventSearchPage } from './event-search.page';

const routes: Routes = [
  {
    path: '',
    component: EventSearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventSearchPageRoutingModule {}
