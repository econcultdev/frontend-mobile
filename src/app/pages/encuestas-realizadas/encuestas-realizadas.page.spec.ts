import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncuestasRealizadasPage } from './encuestas-realizadas.page';

describe('EncuestasRealizadasPage', () => {
  let component: EncuestasRealizadasPage;
  let fixture: ComponentFixture<EncuestasRealizadasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EncuestasRealizadasPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncuestasRealizadasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
