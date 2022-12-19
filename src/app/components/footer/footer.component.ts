import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import { TranslateConfigService } from 'src/app/services/translate-config.service';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {

  constructor(private router: Router,
    private utilsService: UtilsService,
    private translateConfigService: TranslateConfigService) { }
  
    

  ngOnInit() {}
    
  showChat() {
    
    this.router.navigate(['/messages']);
  }

  changeAttributesByLanguage(singleValue, multiLanguageValue) {
    return this.utilsService.changeAttributesByLanguage(singleValue, multiLanguageValue);
  }
}
