import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';


import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';

import { MatNativeDateModule } from '@angular/material/core';



@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss'],
})
export class DateRangeComponent implements OnInit {

  startDate:Date;
  constructor(public modalCtrl: ModalController) { }
  today: any;
  dateSelect = new Date();
  tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  startTime = (new Date(this.dateSelect.getDate() - this.tzoffset)).toISOString().slice(0, -1);
  @Output() filterSelectI = new EventEmitter<Date>();
  onchangeDate() {
    this.filterSelectI.emit(this.dateSelect);
  }


  ngOnInit() {
    this.getDate();

  }

  getDate() 
  { 
    const date = new Date(); 
    this.dateSelect = new Date(); 
    this.today = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
     console.log(this.today); 
  }


}
