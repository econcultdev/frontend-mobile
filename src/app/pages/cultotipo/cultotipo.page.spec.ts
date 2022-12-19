import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CultotipoPage } from './cultotipo.page';

describe('CultotipoPage', () => {
  let component: CultotipoPage;
  let fixture: ComponentFixture<CultotipoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CultotipoPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CultotipoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
