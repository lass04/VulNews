import { TestBed } from '@angular/core/testing';

import { CommentaireSvc } from './commentaire-svc';

describe('CommentaireSvc', () => {
  let service: CommentaireSvc;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentaireSvc);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
