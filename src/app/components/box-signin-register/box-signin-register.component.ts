import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { TranslateConfigService } from 'src/app/services/translate-config.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-box-signin-register',
  templateUrl: './box-signin-register.component.html',
  styleUrls: ['./box-signin-register.component.scss'],
})
export class BoxSigninRegisterComponent implements OnInit {

  @Input() verifylogin = false;
  constructor(private platform: Platform,
    private translateConfigService: TranslateConfigService,
    private utilsService: UtilsService,
    private router: Router) { }


  changeAttributesByLanguage(singleValue, multiLanguageValue) {
    return this.utilsService.changeAttributesByLanguage(singleValue, multiLanguageValue);
  }
  ngOnInit() { }

  navigateLoginRegister() {
    this.router.navigate(['/login'])
  }

}
