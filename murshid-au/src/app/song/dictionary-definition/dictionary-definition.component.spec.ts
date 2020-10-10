import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DictionaryDefinitionComponent } from './dictionary-definition.component';

describe('DictionaryDefinitionComponent', () => {
  let component: DictionaryDefinitionComponent;
  let fixture: ComponentFixture<DictionaryDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DictionaryDefinitionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DictionaryDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
