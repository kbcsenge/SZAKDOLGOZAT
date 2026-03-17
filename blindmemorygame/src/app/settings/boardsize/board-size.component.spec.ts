import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardSizeComponent } from './board-size.component';

describe('BoardSizeComponent', () => {
  let component: BoardSizeComponent;
  let fixture: ComponentFixture<BoardSizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoardSizeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
