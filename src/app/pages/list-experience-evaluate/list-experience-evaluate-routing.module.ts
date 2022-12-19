import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListExperienceEvaluatePage } from './list-experience-evaluate.page';

const routes: Routes = [
  {
    path: '',
    component: ListExperienceEvaluatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListExperienceEvaluatePageRoutingModule {}
