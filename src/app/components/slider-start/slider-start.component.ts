import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-slider-start',
  templateUrl: './slider-start.component.html',
  styleUrls: ['./slider-start.component.scss'],
})
export class SliderStartComponent implements OnInit {

  @ViewChild('slides', { static: false }) slides: IonSlides;

  slideOpts = {
    initialSlide: 0,
    speed: 700
  };

  constructor(
    private utilService: UtilsService
  ) { }

  ngOnInit() { }

  swipeNext() {
    this.slides.slideNext()
  }

  closeSlides() {
    this.utilService.closeSlidesStart();
  }

}
