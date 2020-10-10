import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularCoverComponent } from './regular-cover.component';

describe('RegularCoverComponent', () => {
  let component: RegularCoverComponent;
  let fixture: ComponentFixture<RegularCoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegularCoverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegularCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
