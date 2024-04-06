import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumeandspeedComponent } from './volumeandspeed.component';

describe('VolumeandspeedComponent', () => {
  let component: VolumeandspeedComponent;
  let fixture: ComponentFixture<VolumeandspeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VolumeandspeedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VolumeandspeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
