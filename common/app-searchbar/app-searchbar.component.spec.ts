import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSearchbarComponent } from './app-searchbar.component';

describe('AppSearchbarComponent', () => {
  let component: AppSearchbarComponent;
  let fixture: ComponentFixture<AppSearchbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppSearchbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSearchbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
