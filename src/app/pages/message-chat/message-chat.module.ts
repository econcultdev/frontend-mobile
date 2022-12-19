import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MessageChatPageRoutingModule } from './message-chat-routing.module';

import { MessageChatPage } from './message-chat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MessageChatPageRoutingModule
  ],
  declarations: [MessageChatPage]
})
export class MessageChatPageModule {}
