import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoplayergameComponent } from './twoplayergame.component';

describe('TwoplayergameComponent', () => {
  let component: TwoplayergameComponent;
  let fixture: ComponentFixture<TwoplayergameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TwoplayergameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TwoplayergameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
