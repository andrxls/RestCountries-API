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
}