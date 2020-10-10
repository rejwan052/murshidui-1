import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptSelectionComponent } from './script-selection.component';

describe('ScriptSelectionComponent', () => {
  let component: ScriptSelectionComponent;
  let fixture: ComponentFixture<ScriptSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScriptSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
