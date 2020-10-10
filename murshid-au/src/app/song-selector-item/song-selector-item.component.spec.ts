import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongSelectorItemComponent } from './song-selector-item.component';

describe('SongSelectorItemComponent', () => {
  let component: SongSelectorItemComponent;
  let fixture: ComponentFixture<SongSelectorItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SongSelectorItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SongSelectorItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
