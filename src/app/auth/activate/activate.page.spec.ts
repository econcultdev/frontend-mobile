import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatePage } from './activate.page';

describe('ActivatePage', () => {
  let component: ActivatePage;
  let fixture: ComponentFixture<ActivatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
