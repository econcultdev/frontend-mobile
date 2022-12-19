//import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BoxSigninRegisterComponent } from './box-signin-register.component';

describe('BoxSigninRegisterComponent', () => {
  let component: BoxSigninRegisterComponent;
  let fixture: ComponentFixture<BoxSigninRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxSigninRegisterComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BoxSigninRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
