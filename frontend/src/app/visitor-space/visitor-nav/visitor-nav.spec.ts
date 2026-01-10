import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorNav } from './visitor-nav';

describe('VisitorNav', () => {
  let component: VisitorNav;
  let fixture: ComponentFixture<VisitorNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitorNav]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitorNav);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
