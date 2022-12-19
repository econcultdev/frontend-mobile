import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";

import {SecurePipe} from "./secure.pipe";
import { PosterPipe } from './poster.pipe';

@NgModule({
  declarations:[SecurePipe, PosterPipe],
  imports:[CommonModule],
  exports:[SecurePipe, PosterPipe]
})

export class Pipes{}