import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CountriesService } from '../../core/services/countries';

@Component({
  selector: 'app-country-details',
  imports: [],
  templateUrl: './country-details.html',
  styleUrl: './country-details.css'
})
export class CountryDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly countriesService = inject(CountriesService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  country: any;
  loading = true;
  error = '';

  ngOnInit(): void {
    const countryNameFromRoute = this.route.snapshot.paramMap.get('name');

    if (!countryNameFromRoute) {
      this.error = 'País não informado.';
      this.loading = false;
      return;
    }

    const decodedCountryName = decodeURIComponent(countryNameFromRoute);

    this.countriesService.getCountries().subscribe({
      next: (countries) => {
        this.country = countries.find((country) => {
          return country.names?.common === decodedCountryName;
        });

        if (!this.country) {
          this.error = 'País não encontrado.';
        }

        this.loading = false;
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao carregar país:', error);
        this.error = 'Erro ao carregar país.';
        this.loading = false;
        this.changeDetector.detectChanges();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}