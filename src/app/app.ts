import { Component, OnInit, inject } from '@angular/core';
import { CountriesService } from './core/services/countries';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly countriesService = inject(CountriesService);

  countries: any[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.countriesService.getCountries().subscribe({
      next: (countries) => {
        this.countries = countries;
        this.loading = false;
        console.log('Países carregados:', countries);
      },
      error: (error) => {
        console.error('Erro ao carregar países:', error);
        this.error = 'Erro ao carregar países.';
        this.loading = false;
      }
    });
  }
}