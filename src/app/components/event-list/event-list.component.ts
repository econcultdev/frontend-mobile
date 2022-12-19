import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent implements OnInit {

  @Input() eventosSearch = [];
  private _translateServiceSubscription: Subscription;
  constructor(private utilsService: UtilsService,
    private router: Router,
    ) { }

  changeAttributesByLanguage(singleValue, multiLanguageValue) {
    return this.utilsService.changeAttributesByLanguage(singleValue, multiLanguageValue);
  }

  navigate(id) {
    this.router.navigate(['/homeapp/'+id])
  }

  ngOnInit() {}

  

}
