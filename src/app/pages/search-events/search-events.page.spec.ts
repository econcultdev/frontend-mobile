import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SearchEventsPage } from './search-events.page';

describe('SearchEventsPage', () => {
  let component: SearchEventsPage;
  let fixture: ComponentFixture<SearchEventsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchEventsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchEventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
