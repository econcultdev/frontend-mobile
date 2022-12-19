import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncuestaPersonalPage } from './encuesta-personal.page';

describe('EncuestaPersonalPage', () => {
  let component: EncuestaPersonalPage;
  let fixture: ComponentFixture<EncuestaPersonalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EncuestaPersonalPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncuestaPersonalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
