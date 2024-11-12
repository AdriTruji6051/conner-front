import { TestBed } from '@angular/core/testing';

import { IaDataScienceService } from './ia-data-science.service';

describe('IaDataScienceService', () => {
  let service: IaDataScienceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IaDataScienceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
