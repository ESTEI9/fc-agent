import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoopPage } from './coop.page';

describe('CoopPage', () => {
  let component: CoopPage;
  let fixture: ComponentFixture<CoopPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoopPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoopPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
