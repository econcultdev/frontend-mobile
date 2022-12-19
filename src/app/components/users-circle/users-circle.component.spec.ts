import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UsersCircleComponent } from './users-circle.component';

describe('UsersCircleComponent', () => {
  let component: UsersCircleComponent;
  let fixture: ComponentFixture<UsersCircleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersCircleComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
