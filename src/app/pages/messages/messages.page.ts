import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateConfigService } from 'src/app/services/translate-config.service';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {

  menssages: any[] = [];
  verifylogin = false;
  session="399";
  constructor(
    private authService: AuthService,
    private platform: Platform,
    private translateConfigService: TranslateConfigService,
    private utilsService: UtilsService) { }


  changeAttributesByLanguage(singleValue, multiLanguageValue) {
    return this.utilsService.changeAttributesByLanguage(singleValue, multiLanguageValue);
  }

  ionViewWillEnter() {
    
    if (this.authService.whoAmI()) {
      this.verifylogin = true;
    } else {
      this.verifylogin = false;
    }
  }
  modalData =[
    {
    id:1,
    name: 'Mario',
    imagen: 'https://i.pravatar.cc/150',
    lastMSG:{
      id:1,
      msg:'show  message ha encontrado resultados  para  most  part  ser  informado   al'
    }
  },
  {
    id:2,
    name: 'Karla',
    imagen: 'https://i.pravatar.cc/150',
    lastMSG:{
      id:2,
      msg:'show  message ha encontrado resultados  para  most  part  ser  informado   al'
    }
  },
  {
    id:3,
    name: 'Juan',
    imagen: 'https://i.pravatar.cc/150',
    lastMSG:{
      id:2,
      msg:'show  message ha encontrado resultados  para  most  part  ser  informado   al'
    }
  },
]

openChat()
{

}
  /* @
    loadMenssages(max?: any, event?: any, date?: Date) {
  
      this.apiService.getUserConversation(this.userId)
        .subscribe((res) => {
          if (max) {
            this.proccessEventsResults(res, max, event);
          } else {
            this.proccessEventsResults(res);
          }
        }, (err) => {
          this.dismiss();
          console.error(err);
          this.utilsService.presentToastLanguage('EVENTOS_DESTACADOS_TS.SERVER_ERROR');
        });
    }*/

  ngOnInit() {
  }
  


}
