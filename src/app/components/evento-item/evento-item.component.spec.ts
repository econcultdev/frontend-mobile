import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EventoItemComponent } from './evento-item.component';
import {APP_BASE_HREF}    from '@angular/common';


describe('EventoItemComponent', () => {
  let component: EventoItemComponent;
  let fixture: ComponentFixture<EventoItemComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ EventoItemComponent ],
      imports: [IonicModule.forRoot()],
      providers: [{provide: APP_BASE_HREF, useValue: '/'}]
    }).compileComponents();

    fixture = TestBed.createComponent(EventoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
