import { TestBed } from '@angular/core/testing';

import { PostSvc } from './post-svc';

describe('PostSvc', () => {
  let service: PostSvc;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostSvc);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
