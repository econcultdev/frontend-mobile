import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterMinifyPage } from './register-minify.page';

describe('RegisterMinifyPage', () => {
  let component: RegisterMinifyPage;
  let fixture: ComponentFixture<RegisterMinifyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterMinifyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterMinifyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
