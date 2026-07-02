import { Routes } from '@angular/router';
import { CountriesList } from './pages/countries-list/countries-list';
import { CountryDetails } from './pages/country-details/country-details';

export const routes: Routes = [
  {
    path: '',
    component: CountriesList
  },
  {
    path: 'pais/:name',
    component: CountryDetails
  },
  {
    path: '**',
    redirectTo: ''
  }
];