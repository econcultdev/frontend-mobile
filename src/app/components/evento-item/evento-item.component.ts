import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Evento } from 'src/app/models/evento';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-evento-item',
  templateUrl: './evento-item.component.html',
  styleUrls: ['./evento-item.component.scss'],
})
export class EventoItemComponent implements OnInit {

  @Input() eventos: Evento;
  constructor(private router: Router, 
    private utilsService: UtilsService,) { }

  ngOnInit() {
  }
  //[routerLink]="['/homeapp', evento.id]"
  showEvent(id: number) {
      this.router.navigate(['/homeapp', id]);
  }

  changeAttributesByLanguage(singleValue, multiLanguageValue) {
    return this.utilsService.changeAttributesByLanguage(singleValue, multiLanguageValue);
  }

}