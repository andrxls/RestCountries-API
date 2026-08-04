import { ChangeDetectorRef, Component, HostListener, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Country } from '../../core/models/country';
import { CountriesService } from '../../core/services/countries';
import { ThemeService } from '../../core/services/theme';
import { translateRegion } from '../../core/utils/country-translations';

interface FilterOption {
  value: string;
  label: string;
}

interface SubregionGroup {
  label: string;
  options: FilterOption[];
}

interface PopulationOption {
  min: number;
  max: number | null;
  label: string;
}

type SortOption =
  'name-asc' | 'name-desc' | 'population-asc' | 'population-desc' | 'area-asc' | 'area-desc';

const REGION_OPTIONS: FilterOption[] = [
  { value: 'Africa', label: 'África' },
  { value: 'Americas', label: 'Américas' },
  { value: 'Antarctic', label: 'Antártica' },
  { value: 'Asia', label: 'Ásia' },
  { value: 'Europe', label: 'Europa' },
  { value: 'Oceania', label: 'Oceania' },
];

const SUBREGION_GROUPS: SubregionGroup[] = [
  {
    label: 'África',
    options: [
      { value: 'Middle Africa', label: 'África Central' },
      { value: 'Western Africa', label: 'África Ocidental' },
      { value: 'Eastern Africa', label: 'África Oriental' },
      { value: 'Northern Africa', label: 'África Setentrional' },
      { value: 'Southern Africa', label: 'África Austral' },
    ],
  },
  {
    label: 'Américas',
    options: [
      { value: 'North America', label: 'América do Norte' },
      { value: 'Central America', label: 'América Central' },
      { value: 'South America', label: 'América do Sul' },
      { value: 'Caribbean', label: 'Caribe' },
    ],
  },
  {
    label: 'Ásia',
    options: [
      { value: 'Central Asia', label: 'Ásia Central' },
      { value: 'Eastern Asia', label: 'Ásia Oriental' },
      { value: 'South-Eastern Asia', label: 'Sudeste Asiático' },
      { value: 'Southern Asia', label: 'Sul da Ásia' },
      { value: 'Western Asia', label: 'Oeste da Ásia' },
    ],
  },
  {
    label: 'Europa',
    options: [
      { value: 'Northern Europe', label: 'Europa Setentrional' },
      { value: 'Western Europe', label: 'Europa Ocidental' },
      { value: 'Southern Europe', label: 'Europa Meridional' },
      { value: 'Eastern Europe', label: 'Europa Oriental' },
    ],
  },
  {
    label: 'Oceania',
    options: [
      { value: 'Australia and New Zealand', label: 'Austrália e Nova Zelândia' },
      { value: 'Melanesia', label: 'Melanésia' },
      { value: 'Micronesia', label: 'Micronésia' },
      { value: 'Polynesia', label: 'Polinésia' },
    ],
  },
];

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'name-asc', label: 'Nome (A-Z)' },
  { value: 'name-desc', label: 'Nome (Z-A)' },
  { value: 'population-asc', label: 'População crescente' },
  { value: 'population-desc', label: 'População decrescente' },
  { value: 'area-asc', label: 'Área crescente' },
  { value: 'area-desc', label: 'Área decrescente' },
];

const POPULATION_OPTIONS: PopulationOption[] = [
  { min: 0, max: 1_000_000, label: '< 1M' },
  { min: 1_000_000, max: 10_000_000, label: '1M - 10M' },
  { min: 10_000_000, max: 100_000_000, label: '10M - 100M' },
  { min: 100_000_000, max: null, label: '> 100M' },
];

@Component({
  selector: 'app-countries-list',
  imports: [RouterLink],
  templateUrl: './countries-list.html',
  styleUrl: './countries-list.css',
})
export class CountriesList implements OnInit {
  private readonly countriesService = inject(CountriesService);
  private readonly themeService = inject(ThemeService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  readonly isDarkMode = this.themeService.isDarkMode;
  readonly regionOptions = REGION_OPTIONS;
  readonly subregionGroups = SUBREGION_GROUPS;
  readonly subregionOptions = SUBREGION_GROUPS.flatMap((group) => group.options);
  readonly sortOptions = SORT_OPTIONS;
  readonly populationOptions = POPULATION_OPTIONS;

  countries: Country[] = [];
  filteredCountries: Country[] = [];
  loading = true;
  error = '';
  readonly itemsPerPage = 20;
  visibleCount = this.itemsPerPage;

  searchTerm = '';
  activeRegion = '';
  activeSubregion = '';
  activeSort: SortOption | '' = '';
  activeFilterLabel = '';
  activeSortLabel = '';
  populationMin: number | null = null;
  populationMax: number | null = null;
  activeMobilePanel: 'filter' | 'sort' | null = null;

  ngOnInit(): void {
    this.countriesService.getCountries().subscribe({
      next: (countries) => {
        this.countries = countries;
        this.applyFilters();
        this.loading = false;
        this.changeDetector.markForCheck();
      },
      error: (error: unknown) => {
        console.error('Erro ao carregar países:', error);
        this.error = 'Erro ao carregar países.';
        this.loading = false;
        this.changeDetector.markForCheck();
      },
    });
  }

  get visibleCountries(): Country[] {
    return this.filteredCountries.slice(0, this.visibleCount);
  }

  get hasMoreCountries(): boolean {
    return this.visibleCount < this.filteredCountries.length;
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  openMobilePanel(panel: 'filter' | 'sort'): void {
    this.activeMobilePanel = panel;
  }

  closeMobilePanel(): void {
    this.activeMobilePanel = null;
  }

  translateRegion(region: string | null | undefined): string {
    return translateRegion(region);
  }

  loadMore(): void {
    this.visibleCount += this.itemsPerPage;
  }

  onSearch(value: string): void {
    this.searchTerm = value;
    this.applyFilters();
  }

  onSearchInput(event: Event): void {
    this.onSearch((event.target as HTMLInputElement).value);
  }

  filterByRegion(region: string, label: string): void {
    this.activeRegion = region;
    this.activeSubregion = '';
    this.populationMin = null;
    this.populationMax = null;
    this.activeFilterLabel = label;
    this.applyFilters();
    this.closeMobilePanel();
  }

  filterBySubregion(subregion: string, label: string): void {
    this.activeSubregion = subregion;
    this.activeRegion = '';
    this.populationMin = null;
    this.populationMax = null;
    this.activeFilterLabel = label;
    this.applyFilters();
    this.closeMobilePanel();
  }

  filterByPopulation(min: number, max: number | null, label: string): void {
    this.populationMin = min;
    this.populationMax = max;
    this.activeRegion = '';
    this.activeSubregion = '';
    this.activeFilterLabel = label;
    this.applyFilters();
    this.closeMobilePanel();
  }

  sortBy(sort: SortOption, label: string): void {
    this.activeSort = sort;
    this.activeSortLabel = label;
    this.applySorting();
    this.closeMobilePanel();
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
    this.visibleCount = this.itemsPerPage;
    this.applyFilters();
    this.closeMobilePanel();
  }

  applyFilters(): void {
    const normalizedSearch = this.normalizeText(this.searchTerm);

    this.filteredCountries = this.countries.filter((country) => {
      const searchableName = this.normalizeText(
        [
          country.names.common,
          country.names.official,
          country.names.translations?.por?.common,
          country.names.translations?.por?.official,
          ...(country.names.alternates ?? []),
        ]
          .filter(Boolean)
          .join(' '),
      );

      const matchesSearch = !normalizedSearch || searchableName.includes(normalizedSearch);
      const matchesRegion = !this.activeRegion || country.region === this.activeRegion;
      const matchesSubregion = !this.activeSubregion || country.subregion === this.activeSubregion;
      const population = country.population ?? 0;
      const matchesPopulation =
        this.populationMin === null ||
        (population >= this.populationMin &&
          (this.populationMax === null || population < this.populationMax));

      return matchesSearch && matchesRegion && matchesSubregion && matchesPopulation;
    });

    this.visibleCount = this.itemsPerPage;
    this.applySorting();
  }

  applySorting(): void {
    this.filteredCountries = [...this.filteredCountries].sort((a, b) => {
      switch (this.activeSort) {
        case 'name-asc':
          return a.names.common.localeCompare(b.names.common, 'pt-BR');
        case 'name-desc':
          return b.names.common.localeCompare(a.names.common, 'pt-BR');
        case 'population-asc':
          return (a.population ?? 0) - (b.population ?? 0);
        case 'population-desc':
          return (b.population ?? 0) - (a.population ?? 0);
        case 'area-asc':
          return (a.area?.kilometers ?? 0) - (b.area?.kilometers ?? 0);
        case 'area-desc':
          return (b.area?.kilometers ?? 0) - (a.area?.kilometers ?? 0);
        default:
          return 0;
      }
    });
  }

  normalizeText(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const distanceFromBottom =
      document.documentElement.scrollHeight - (window.innerHeight + window.scrollY);

    if (distanceFromBottom < 250 && this.hasMoreCountries) {
      this.loadMore();
    }
  }
}
