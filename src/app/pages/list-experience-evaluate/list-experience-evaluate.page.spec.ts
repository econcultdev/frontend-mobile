import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListExperienceEvaluatePage } from './list-experience-evaluate.page';

describe('ListExperienceEvaluatePage', () => {
  let component: ListExperienceEvaluatePage;
  let fixture: ComponentFixture<ListExperienceEvaluatePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListExperienceEvaluatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListExperienceEvaluatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
