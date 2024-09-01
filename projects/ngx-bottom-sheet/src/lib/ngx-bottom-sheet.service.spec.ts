import { TestBed } from '@angular/core/testing';

import { NgxBottomSheetService } from './ngx-bottom-sheet.service';

describe('NgxBottomSheetService', () => {
  let service: NgxBottomSheetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxBottomSheetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
