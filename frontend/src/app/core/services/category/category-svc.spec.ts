import { TestBed } from '@angular/core/testing';

import { CategorySvc } from './category-svc';

describe('CategorySvc', () => {
  let service: CategorySvc;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategorySvc);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
