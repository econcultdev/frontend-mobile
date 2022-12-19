import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef, PLATFORM_ID, Inject, OnDestroy } from '@angular/core';
import { isPlatformServer } from '@angular/common';

declare let require: any;
const lottie: any = require('lottie-web/build/player/lottie.js');

@Component({
  selector: 'app-lottie-animation-view',
  templateUrl: './lottie-animation-view.component.html',
  styleUrls: ['./lottie-animation-view.component.scss']
})

export class LottieAnimationViewComponent implements OnInit, OnDestroy {
  private anim: any;
  public viewWidth: string;
  public viewHeight: string;
  private optionsData: any;

  @ViewChild('lavContainer', { static: true }) lavContainer: ElementRef;
  @Input() width: number;
  @Input() height: number;
  @Input()
  set options(options: any) {
    this.optionsData = {
      container: this.lavContainer.nativeElement,
      renderer: options.renderer || 'svg',
      loop: options.loop !== false,
      autoplay: options.autoplay !== false,
      autoloadSegments: options.autoloadSegments !== false,
      animationData: options.animationData,
      path: options.path || '',
      rendererSettings: options.rendererSettings || {}
    };
    this.load();
  }
  @Output() animCreated: any = new EventEmitter();

  constructor(
    @Inject(PLATFORM_ID) private platformId: string
  ) { }

  ngOnInit() {
    if (isPlatformServer(this.platformId)) {
      return;
    }
  }

  load(path?: string) {
    if (this.anim) {
      this.anim.destroy();
    }
    if (path) {
      this.optionsData.path = path;
    }

    this.viewWidth = this.width + 'px' || '100%';
    this.viewHeight = this.height + 'px' || '100%';

    this.anim = lottie.loadAnimation(this.optionsData);
    this.animCreated.emit(this.anim);
  }

  ngOnDestroy() {
    if (this.anim) {
      this.anim.destroy();
    }
  }
}