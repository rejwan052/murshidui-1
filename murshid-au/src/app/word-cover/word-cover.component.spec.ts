import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordCoverComponent } from './word-cover.component';

describe('WordCoverComponent', () => {
  let component: WordCoverComponent;
  let fixture: ComponentFixture<WordCoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WordCoverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WordCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
