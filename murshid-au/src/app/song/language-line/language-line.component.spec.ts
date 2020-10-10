import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageLineComponent } from './language-line.component';

describe('LanguageLineComponent', () => {
  let component: LanguageLineComponent;
  let fixture: ComponentFixture<LanguageLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LanguageLineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
