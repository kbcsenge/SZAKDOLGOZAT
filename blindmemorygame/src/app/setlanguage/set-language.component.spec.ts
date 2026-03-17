import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetLanguageComponent } from './set-language.component';

describe('SetLanguageComponent', () => {
  let component: SetLanguageComponent;
  let fixture: ComponentFixture<SetLanguageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SetLanguageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
