import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {
  private readonly http = inject(HttpClient);
  private readonly dataUrl = 'assets/data/countries.json';

  getCountries(): Observable<any[]> {
    return this.http.get<any[]>(this.dataUrl);
  }
}