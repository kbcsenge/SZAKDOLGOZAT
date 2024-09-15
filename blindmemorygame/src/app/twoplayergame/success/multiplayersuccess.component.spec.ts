import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiplayersuccessComponent } from './multiplayersuccess.component';

describe('MultiplayersuccessComponent', () => {
  let component: MultiplayersuccessComponent;
  let fixture: ComponentFixture<MultiplayersuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiplayersuccessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MultiplayersuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
