import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomeappPage } from './homeapp.page';



describe('HomeappPage', () => {
  let component: HomeappPage;
  let fixture: ComponentFixture<HomeappPage>;
  

  

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeappPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeappPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
});
  