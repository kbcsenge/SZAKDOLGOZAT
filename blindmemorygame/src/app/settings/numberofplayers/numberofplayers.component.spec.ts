import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberofplayersComponent } from './numberofplayers.component';

describe('NumberofplayersComponent', () => {
  let component: NumberofplayersComponent;
  let fixture: ComponentFixture<NumberofplayersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NumberofplayersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NumberofplayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
