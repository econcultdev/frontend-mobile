import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BonosDisponiblesPage } from './bonos-disponibles.page';

describe('BonosDisponiblesPage', () => {
  let component: BonosDisponiblesPage;
  let fixture: ComponentFixture<BonosDisponiblesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BonosDisponiblesPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BonosDisponiblesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
