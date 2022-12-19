import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonMultilanguageModule } from './button-multilanguage/button-multilanguage.module';
import { SliderStartComponent } from './slider-start/slider-start.component';
import { SlideEventTypeComponent } from './slide-event-type/slide-event-type.component';
import { FooterComponent } from './footer/footer.component';
import { SwiperModule } from 'swiper/angular';
import { EventoItemComponent } from './evento-item/evento-item.component';
import { TimeAgoPipe } from 'time-ago-pipe';
import { LikeEventComponent } from './like-event/like-event.component';
import { MenuComponent } from './menu/menu.component';
import { UsersCircleComponent } from './users-circle/users-circle.component';
import { EventListComponent } from './event-list/event-list.component';
import { ChatsComponent } from './chats/chats.component';
import { ButtonBackArrowComponent } from './button-back-arrow/button-back-arrow.component';
import { BoxSigninRegisterComponent } from './box-signin-register/box-signin-register.component';
import { DateRangeComponent } from './date-range/date-range.component';
import { SearchModalPopupComponent } from './search-modal-popup/search-modal-popup.component';
import { CityLocationComponent } from './city-location/city-location.component';
//import { MapComponent } from './map/map.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SliderStartComponent,
    SlideEventTypeComponent,
    FooterComponent,
    EventoItemComponent,
    TimeAgoPipe,
    LikeEventComponent,
    MenuComponent,
    UsersCircleComponent,
    EventListComponent,
    ChatsComponent,
    ButtonBackArrowComponent,
    BoxSigninRegisterComponent,
    DateRangeComponent,
    SearchModalPopupComponent,
    CityLocationComponent,
    
  ],
  imports: [
    ButtonMultilanguageModule,
    CommonModule,
    TranslateModule,
    IonicModule,
    SwiperModule,
    ReactiveFormsModule,
    FormsModule,
    
  ],
  exports: [
    HeaderComponent,
    SliderStartComponent,
    SlideEventTypeComponent,
    FooterComponent,
    EventoItemComponent,
    LikeEventComponent,
    MenuComponent,
    UsersCircleComponent,
    EventListComponent,
    ChatsComponent,
    ButtonBackArrowComponent,
    BoxSigninRegisterComponent,
    DateRangeComponent,
    SearchModalPopupComponent,
    CityLocationComponent,
  ]
})
export class SharedComponentsModule { }