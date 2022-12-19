import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderStartComponent } from './slider-start.component';

describe('SliderStartComponent', () => {
  let component: SliderStartComponent;
  let fixture: ComponentFixture<SliderStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SliderStartComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
