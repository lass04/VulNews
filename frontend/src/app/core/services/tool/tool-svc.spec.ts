import { TestBed } from '@angular/core/testing';

import { ToolSvc } from './tool-svc';

describe('ToolSvc', () => {
  let service: ToolSvc;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToolSvc);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
