import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumeAndSpeedComponent } from './volume-and-speed.component';

describe('VolumeAndSpeedComponent', () => {
  let component: VolumeAndSpeedComponent;
  let fixture: ComponentFixture<VolumeAndSpeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VolumeAndSpeedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VolumeAndSpeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
