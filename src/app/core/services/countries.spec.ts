import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CountriesService } from './countries';

describe('CountriesService', () => {
  let service: CountriesService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CountriesService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('should load and cache countries', () => {
    const firstSubscriber = vi.fn();
    const secondSubscriber = vi.fn();

    service.getCountries().subscribe(firstSubscriber);
    const request = httpTesting.expectOne('assets/data/countries.json');
    request.flush([]);

    service.getCountries().subscribe(secondSubscriber);
    httpTesting.expectNone('assets/data/countries.json');

    expect(firstSubscriber).toHaveBeenCalledWith([]);
    expect(secondSubscriber).toHaveBeenCalledWith([]);
  });
});
