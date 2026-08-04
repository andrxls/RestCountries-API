import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as L from 'leaflet';
import { Country } from '../../core/models/country';
import { CountriesService } from '../../core/services/countries';
import { translateRegion, translateSubregion } from '../../core/utils/country-translations';

@Component({
  selector: 'app-country-details',
  imports: [],
  templateUrl: './country-details.html',
  styleUrl: './country-details.css',
})
export class CountryDetails implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly countriesService = inject(CountriesService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  country?: Country;
  loading = true;
  error = '';

  private map?: L.Map;
  private mapElement?: HTMLElement;

  @ViewChild('mapElement')
  set mapContainer(container: ElementRef<HTMLElement> | undefined) {
    this.mapElement = container?.nativeElement;
    this.tryCreateMap();
  }

  ngOnInit(): void {
    const countryName = this.route.snapshot.paramMap.get('name');

    if (!countryName) {
      this.error = 'País não informado.';
      this.loading = false;
      return;
    }

    this.countriesService.getCountries().subscribe({
      next: (countries) => {
        this.country = countries.find((country) => country.names.common === countryName);
        this.loading = false;

        if (!this.country) {
          this.error = 'País não encontrado.';
        }

        this.changeDetector.markForCheck();
      },
      error: (error: unknown) => {
        console.error('Erro ao carregar país:', error);
        this.error = 'Erro ao carregar país.';
        this.loading = false;
        this.changeDetector.markForCheck();
      },
    });
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  translateRegion(region: string | null | undefined): string {
    return translateRegion(region);
  }

  translateSubregion(subregion: string | null | undefined): string {
    return translateSubregion(subregion);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  private getCoordinates(): [number, number] | null {
    const lat = this.country?.coordinates?.lat;
    const lng = this.country?.coordinates?.lng;

    return typeof lat === 'number' && typeof lng === 'number' ? [lat, lng] : null;
  }

  private tryCreateMap(): void {
    if (!this.mapElement || !this.country || this.map) {
      return;
    }

    const coordinates = this.getCoordinates();
    if (!coordinates) {
      return;
    }

    this.map = L.map(this.mapElement).setView(coordinates, 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    L.circleMarker(coordinates, { radius: 8 })
      .addTo(this.map)
      .bindPopup(this.country.names.common)
      .openPopup();

    this.map.invalidateSize();
  }
}
