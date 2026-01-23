import { TestBed } from '@angular/core/testing';

import { ArticleSvc } from './article-svc';

describe('ArticleSvc', () => {
  let service: ArticleSvc;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticleSvc);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
