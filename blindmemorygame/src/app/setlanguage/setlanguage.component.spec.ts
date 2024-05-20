import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetlanguageComponent } from './setlanguage.component';

describe('SetlanguageComponent', () => {
  let component: SetlanguageComponent;
  let fixture: ComponentFixture<SetlanguageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SetlanguageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetlanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
