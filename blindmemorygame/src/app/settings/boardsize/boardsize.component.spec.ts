import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardsizeComponent } from './boardsize.component';

describe('BoardsizeComponent', () => {
  let component: BoardsizeComponent;
  let fixture: ComponentFixture<BoardsizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoardsizeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoardsizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
