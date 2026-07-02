import { ChangeDetectorRef, Component, HostListener, OnInit, inject } from '@angular/core';
import { CountriesService } from '../../core/services/countries';
import { Router } from '@angular/router';
import { translateRegion } from '../../core/utils/country-translations';

@Component({
  selector: 'app-countries-list',
  imports: [],
  templateUrl: './countries-list.html',
  styleUrl: './countries-list.css'
})
export class CountriesList implements OnInit {
  private readonly countriesService = inject(CountriesService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  translateRegion(region: string | null | undefined): string {
    return translateRegion(region);
  }

  openCountryDetails(country: any): void {
  const countryName = country.names?.common;

  if (!countryName) {
    return;
  }

  this.router.navigate(['/pais', countryName]);
}

  countries: any[] = [];
  filteredCountries: any[] = [];
  loading = true;
  error = '';
  itemsPerPage = 20;
  visibleCount = 20;

  ngOnInit(): void {
    this.countriesService.getCountries().subscribe({
      next: (countries) => {
        this.countries = countries;
        this.applyFilters();
        this.loading = false;
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao carregar países:', error);
        this.error = 'Erro ao carregar países.';
        this.loading = false;
      }
    });
  }

get visibleCountries(): any[] {
  return this.filteredCountries.slice(0, this.visibleCount);
}

get hasMoreCountries(): boolean {
  return this.visibleCount < this.filteredCountries.length;
}

loadMore(): void {
  this.visibleCount += this.itemsPerPage;
}

searchTerm = '';
activeRegion = '';
activeSubregion = '';
activeSort = '';
activeFilterLabel = '';
activeSortLabel = '';
populationMin: number | null = null;
populationMax: number | null = null;

onSearch(value: string): void {
  this.searchTerm = value;
  this.applyFilters();
}

filterByRegion(region: string, label: string): void {
  this.activeRegion = region;
  this.activeSubregion = '';
  this.populationMin = null;
  this.populationMax = null;
  this.activeFilterLabel = label;
  this.applyFilters();
}

filterBySubregion(subregion: string, label: string): void {
  this.activeSubregion = subregion;
  this.activeRegion = '';
  this.populationMin = null;
  this.populationMax = null;
  this.activeFilterLabel = label;
  this.applyFilters();
}

filterByPopulation(min: number, max: number | null, label: string): void {
  this.populationMin = min;
  this.populationMax = max;
  this.activeRegion = '';
  this.activeSubregion = '';
  this.activeFilterLabel = label;
  this.applyFilters();
}

sortBy(sort: string, label: string): void {
  this.activeSort = sort;
  this.activeSortLabel = label;
  this.applyFilters();
}

clearFilters(): void {
  this.searchTerm = '';
  this.activeRegion = '';
  this.activeSubregion = '';
  this.activeSort = '';
  this.activeFilterLabel = '';
  this.activeSortLabel = '';
  this.populationMin = null;
  this.populationMax = null;
  this.filteredCountries = this.countries;
  this.visibleCount = this.itemsPerPage;
  this.applySorting();
  
}

applyFilters(): void {
  const normalizedSearch = this.normalizeText(this.searchTerm);

  this.filteredCountries = this.countries.filter((country) => {
    const countryName = this.normalizeText([
      country.names?.common,
      country.names?.official,
      country.names?.translations?.por?.common,
      country.names?.translations?.por?.official,
      ...(country.names?.alternates || [])
    ].filter(Boolean).join(' '));

    const countryRegion = country.region || '';
    const countrySubregion = country.subregion || '';
    const countryPopulation = country.population || 0;

    const matchesSearch = !normalizedSearch || countryName.includes(normalizedSearch);
    const matchesRegion = !this.activeRegion || countryRegion === this.activeRegion;
    const matchesSubregion = !this.activeSubregion || countrySubregion === this.activeSubregion;

    const matchesPopulation =
      this.populationMin === null ||
      (
        countryPopulation >= this.populationMin &&
        (this.populationMax === null || countryPopulation < this.populationMax)
      );

    return matchesSearch && matchesRegion && matchesSubregion && matchesPopulation;
  });

  this.visibleCount = this.itemsPerPage;
  this.applySorting();
}

applySorting(): void {
  const sortedCountries = [...this.filteredCountries];

  sortedCountries.sort((a, b) => {
    const nameA = a.names?.common || '';
    const nameB = b.names?.common || '';
    const populationA = a.population || 0;
    const populationB = b.population || 0;
    const areaA = a.area || 0;
    const areaB = b.area || 0;

    switch (this.activeSort) {
      case 'name-asc':
        return nameA.localeCompare(nameB);

      case 'name-desc':
        return nameB.localeCompare(nameA);

      case 'population-asc':
        return populationA - populationB;

      case 'population-desc':
        return populationB - populationA;

      case 'area-asc':
        return areaA - areaB;

      case 'area-desc':
        return areaB - areaA;

      default:
        return 0;
    }
  });

  this.filteredCountries = sortedCountries;
}

normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

@HostListener('window:scroll')
onWindowScroll(): void {
  const scrollPosition = window.innerHeight + window.scrollY;
  const documentHeight = document.documentElement.scrollHeight;
  const distanceFromBottom = documentHeight - scrollPosition;

  if (distanceFromBottom < 250 && this.hasMoreCountries) {
    this.loadMore();
  }
}
}