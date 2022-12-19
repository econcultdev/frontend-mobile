import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaUsuarioPage } from './ficha-usuario.page';

describe('FichaUsuarioPage', () => {
  let component: FichaUsuarioPage;
  let fixture: ComponentFixture<FichaUsuarioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FichaUsuarioPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
