import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangkingsComponent } from './rangkings.component';

describe('RangkingsComponent', () => {
  let component: RangkingsComponent;
  let fixture: ComponentFixture<RangkingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RangkingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RangkingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
