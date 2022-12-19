import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-lottery',
  templateUrl: './lottery.component.html',
  styleUrls: ['./lottery.component.scss'],
})
export class LotteryComponent implements OnInit, OnDestroy {

  private animation: any;
  lottieConfig: any;

  constructor(
    private router: Router,
    private utilService: UtilsService
  ) { }

  ngOnInit() {
    this.animationLoad('/assets/lottie/lottery.json');
  }

  onClickOk() {
    this.router.navigateByUrl('/datos-personales');
  }

  onClickNOk() {
    
    this.utilService.dismissModal();
  }

  /**
   * Used to assign animation to variable
   * @param animation Animation
   */
  animationCreated(animation: any) {
    this.animation = animation;
  }

  /**
   * Used to start animation with url
   * @param url URL
   */
  animationLoad(url) {
    if (this.animation) {
      this.animation.destroy();
    }
    this.lottieConfig = {
      path: url,
      renderer: 'canvas',
      autoplay: true,
      loop: true
    };
  }

  ngOnDestroy() {
    if (this.animation) {
      this.animation.destroy();
    }
  }

}
