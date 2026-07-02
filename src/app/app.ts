import { Component } from '@angular/core';
import { Header } from './shared/header/header';
import { CountriesList } from './pages/countries-list/countries-list';

@Component({
  selector: 'app-root',
  imports: [Header, CountriesList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}