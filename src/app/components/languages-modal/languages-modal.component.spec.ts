import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguagesModalComponent } from './languages-modal.component';

describe('LanguagesModalComponent', () => {
  let component: LanguagesModalComponent;
  let fixture: ComponentFixture<LanguagesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LanguagesModalComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguagesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
