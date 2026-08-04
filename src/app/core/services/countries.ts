import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Country } from '../models/country';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  private readonly http = inject(HttpClient);
  private readonly dataUrl = 'assets/data/countries.json';
  private readonly countries$ = this.http
    .get<Country[]>(this.dataUrl)
    .pipe(shareReplay({ bufferSize: 1, refCount: false }));

  getCountries(): Observable<Country[]> {
    return this.countries$;
  }
}
