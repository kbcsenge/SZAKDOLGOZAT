import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiPlayerComponent } from './multi-player.component';

describe('MultiPlayerComponent', () => {
  let component: MultiPlayerComponent;
  let fixture: ComponentFixture<MultiPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiPlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
