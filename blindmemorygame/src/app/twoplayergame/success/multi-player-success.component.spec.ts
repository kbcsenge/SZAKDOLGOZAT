import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiPlayerSuccessComponent } from './multi-player-success.component';

describe('MultiPlayerSuccessComponent', () => {
  let component: MultiPlayerSuccessComponent;
  let fixture: ComponentFixture<MultiPlayerSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiPlayerSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiPlayerSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
