import { ChangeDetectorRef, Component, AfterViewInit, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CountriesService } from '../../core/services/countries';
import { translateRegion, translateSubregion } from '../../core/utils/country-translations';
import * as L from 'leaflet';

@Component({
  selector: 'app-country-details',
  imports: [],
  templateUrl: './country-details.html',
  styleUrl: './country-details.css'
})
export class CountryDetails implements OnInit, AfterViewInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly countriesService = inject(CountriesService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  country: any;
  loading = true;
  error = '';

  private map?: L.Map;
  private viewReady = false;

  translateRegion(region: string | null | undefined): string {
    return translateRegion(region);
  }

  translateSubregion(subregion: string | null | undefined): string {
    return translateSubregion(subregion);
  }

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
        this.loading = false;
        this.changeDetector.detectChanges();
        return;
      }

      this.loading = false;
      this.changeDetector.detectChanges();

      setTimeout(() => {
        this.tryCreateMap();
      });
    },
      error: (error) => {
        console.error('Erro ao carregar país:', error);
        this.error = 'Erro ao carregar país.';
        this.loading = false;
        this.changeDetector.detectChanges();
      }
    });
  }

  getCoordinates(): [number, number] | null {
  const lat = this.country?.coordinates?.lat;
  const lng = this.country?.coordinates?.lng;

  if (typeof lat !== 'number' || typeof lng !== 'number') {
    console.warn('Coordenadas inválidas ou ausentes:', this.country?.coordinates);
    return null;
  }

  return [lat, lng];
}

tryCreateMap(): void {
  if (!this.viewReady || !this.country || this.map) {
    return;
  }

  const coordinates = this.getCoordinates();

  if (!coordinates) {
    return;
  }

  const [lat, lng] = coordinates;

  const mapElement = document.getElementById('mapa-pais');

  if (!mapElement) {
    console.warn('Elemento #mapa-pais ainda não existe no HTML.');
    return;
  }

  this.map = L.map(mapElement).setView([lat, lng], 4);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(this.map);

  L.circleMarker([lat, lng], {
    radius: 8
  })
    .addTo(this.map)
    .bindPopup(this.country.names?.common || 'País')
    .openPopup();

  setTimeout(() => {
    this.map?.invalidateSize();
  });
}

  ngAfterViewInit(): void {
  this.viewReady = true;
  this.tryCreateMap();
}

ngOnDestroy(): void {
  if (this.map) {
    this.map.remove();
  }
}

  goBack(): void {
    this.router.navigate(['/']);
  }
}