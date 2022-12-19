import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-button-back-arrow',
  templateUrl: './button-back-arrow.component.html',
  styleUrls: ['./button-back-arrow.component.scss'],
})
export class ButtonBackArrowComponent implements OnInit {

  constructor(private router: Router,) { }

  ngOnInit() {}

  navigateHome() {
    this.router.navigate(['app/homeapp/'])
  }

}
