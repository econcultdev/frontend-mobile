import { Component, OnInit, Input } from '@angular/core';
import { IonRouterOutlet, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-search-modal-popup',
  templateUrl: './search-modal-popup.component.html',
  styleUrls: ['./search-modal-popup.component.scss'],
})
export class SearchModalPopupComponent implements OnInit {

  @Input() model_title: string;
  constructor(
    private modalController: ModalController,
    public routerOutlet: IonRouterOutlet,
  ) { }
  ngOnInit() { }
  async closeModel() {
    const close: string = "Modal Removed";
    await this.modalController.dismiss(close);
  }

}
