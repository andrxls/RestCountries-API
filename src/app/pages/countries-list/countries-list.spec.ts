import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Subject } from 'rxjs';
import { Country } from '../../core/models/country';
import { CountriesService } from '../../core/services/countries';
import { ThemeService } from '../../core/services/theme';
import { CountriesList } from './countries-list';

const countries: Country[] = [
  {
    names: {
      common: 'Maior',
      official: 'Maior',
      translations: { por: { common: 'Maior', official: 'Maior' } },
    },
    codes: { alpha_3: 'MAI' },
    region: 'Americas',
    population: 20,
    area: { kilometers: 200 },
  },
  {
    names: { common: 'África', official: 'África' },
    codes: { alpha_3: 'AFR' },
    region: 'Africa',
    population: 10,
    area: { kilometers: 100 },
  },
];

describe('CountriesList', () => {
  let component: CountriesList;
  let fixture: ComponentFixture<CountriesList>;
  let countriesSubject: Subject<Country[]>;

  beforeEach(async () => {
    countriesSubject = new Subject<Country[]>();

    await TestBed.configureTestingModule({
      imports: [CountriesList],
      providers: [
        provideRouter([]),
        { provide: CountriesService, useValue: { getCountries: () => countriesSubject } },
        { provide: ThemeService, useValue: { isDarkMode: signal(false), toggle: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CountriesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
    countriesSubject.next(countries);
    await fixture.whenStable();
  });

  it('should create and load countries', () => {
    expect(component).toBeTruthy();
    expect(component.filteredCountries).toHaveLength(2);
  });

  it('should render countries after the asynchronous response without a user interaction', () => {
    expect((fixture.nativeElement as HTMLElement).querySelectorAll('.caixa-pais')).toHaveLength(2);
    expect((fixture.nativeElement as HTMLElement).textContent).not.toContain('Carregando países');
  });

  it('should search without considering accents', () => {
    component.onSearch('africa');
    expect(component.filteredCountries.map((country) => country.names.common)).toEqual(['África']);
  });

  it('should filter by region', () => {
    component.filterByRegion('Africa', 'África');
    expect(component.filteredCountries.map((country) => country.names.common)).toEqual(['África']);
  });

  it('should sort by numeric area', () => {
    component.sortBy('area-asc', 'Área crescente');
    expect(component.filteredCountries.map((country) => country.area?.kilometers)).toEqual([
      100, 200,
    ]);
  });
});
