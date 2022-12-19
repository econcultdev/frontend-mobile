import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ButtonBackArrowComponent } from './button-back-arrow.component';

describe('ButtonBackArrowComponent', () => {
  let component: ButtonBackArrowComponent;
  let fixture: ComponentFixture<ButtonBackArrowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonBackArrowComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonBackArrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
