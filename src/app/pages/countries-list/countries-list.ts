import { Component, OnInit, inject } from '@angular/core';
import { CountriesService } from '../../core/services/countries';

@Component({
  selector: 'app-countries-list',
  imports: [],
  templateUrl: './countries-list.html',
  styleUrl: './countries-list.css'
})
export class CountriesList implements OnInit {
  private readonly countriesService = inject(CountriesService);

  countries: any[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.countriesService.getCountries().subscribe({
      next: (countries) => {
        this.countries = countries;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar países:', error);
        this.error = 'Erro ao carregar países.';
        this.loading = false;
      }
    });
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
  console.log('Busca:', this.searchTerm);
}

filterByRegion(region: string, label: string): void {
  this.activeRegion = region;
  this.activeSubregion = '';
  this.populationMin = null;
  this.populationMax = null;
  this.activeFilterLabel = label;
  console.log('Região:', region);
}

filterBySubregion(subregion: string, label: string): void {
  this.activeSubregion = subregion;
  this.activeRegion = '';
  this.populationMin = null;
  this.populationMax = null;
  this.activeFilterLabel = label;
  console.log('Sub-região:', subregion);
}

filterByPopulation(min: number, max: number | null, label: string): void {
  this.populationMin = min;
  this.populationMax = max;
  this.activeRegion = '';
  this.activeSubregion = '';
  this.activeFilterLabel = label;
  console.log('População:', min, max);
}

sortBy(sort: string, label: string): void {
  this.activeSort = sort;
  this.activeSortLabel = label;
  console.log('Ordenação:', sort);
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
  console.log('Filtros limpos');
}
}