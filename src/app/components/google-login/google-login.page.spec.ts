import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleLoginPage } from './google-login.page';

describe('GoogleLoginPage', () => {
  let component: GoogleLoginPage;
  let fixture: ComponentFixture<GoogleLoginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GoogleLoginPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
