import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SlideEventTypeComponent } from './slide-event-type.component';

describe('SlideEventTypeComponent', () => {
  let component: SlideEventTypeComponent;
  let fixture: ComponentFixture<SlideEventTypeComponent>;
/*
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlideEventTypeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SlideEventTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));*/

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
