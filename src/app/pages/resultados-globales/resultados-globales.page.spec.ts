import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadosGlobalesPage } from './resultados-globales.page';

describe('ResultadosGlobalesPage', () => {
  let component: ResultadosGlobalesPage;
  let fixture: ComponentFixture<ResultadosGlobalesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResultadosGlobalesPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultadosGlobalesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
