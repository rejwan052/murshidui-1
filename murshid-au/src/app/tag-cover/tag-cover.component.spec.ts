import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagCoverComponent } from './tag-cover.component';

describe('TagCoverComponent', () => {
  let component: TagCoverComponent;
  let fixture: ComponentFixture<TagCoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagCoverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
