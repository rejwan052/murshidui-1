import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongplainComponent } from './songplain.component';

describe('SongplainComponent', () => {
  let component: SongplainComponent;
  let fixture: ComponentFixture<SongplainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SongplainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SongplainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
