import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoEncuestaPage } from './resultado-encuesta.page';

describe('ResultadoEncuestaPage', () => {
  let component: ResultadoEncuestaPage;
  let fixture: ComponentFixture<ResultadoEncuestaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResultadoEncuestaPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultadoEncuestaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
