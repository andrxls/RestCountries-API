import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { Subject } from 'rxjs';
import { Country } from '../../core/models/country';
import { CountriesService } from '../../core/services/countries';
import { CountryDetails } from './country-details';

const country: Country = {
  names: { common: 'Brasil', official: 'República Federativa do Brasil' },
  codes: { alpha_3: 'BRA' },
  area: { kilometers: 8_510_417 },
};

describe('CountryDetails', () => {
  let component: CountryDetails;
  let fixture: ComponentFixture<CountryDetails>;
  let countriesSubject: Subject<Country[]>;

  beforeEach(async () => {
    countriesSubject = new Subject<Country[]>();

    await TestBed.configureTestingModule({
      imports: [CountryDetails],
      providers: [
        provideRouter([]),
        { provide: CountriesService, useValue: { getCountries: () => countriesSubject } },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ name: 'Brasil' }) } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CountryDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
    countriesSubject.next([country]);
    await fixture.whenStable();
  });

  it('should load the country from the route', () => {
    expect(component.country).toEqual(country);
    expect(component.loading).toBe(false);
    expect((fixture.nativeElement as HTMLElement).querySelector('h2')?.textContent).toContain(
      'Brasil',
    );
  });
});
