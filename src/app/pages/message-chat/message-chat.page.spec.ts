import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MessageChatPage } from './message-chat.page';

describe('MessageChatPage', () => {
  let component: MessageChatPage;
  let fixture: ComponentFixture<MessageChatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageChatPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MessageChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
