import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


import { EventSearchPage } from './event-search.page';

describe('EventSearchPage', () => {
  let component: EventSearchPage;
  let fixture: ComponentFixture<EventSearchPage>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ EventSearchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EventSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventSearchPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
