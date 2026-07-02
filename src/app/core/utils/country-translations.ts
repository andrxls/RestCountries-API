export const REGIONS: Record<string, string> = {
  Africa: 'África',
  Americas: 'Américas',
  Antarctic: 'Antártica',
  Asia: 'Ásia',
  Europe: 'Europa',
  Oceania: 'Oceania'
};

export const SUBREGIONS: Record<string, string> = {
  'Middle Africa': 'África Central',
  'Western Africa': 'África Ocidental',
  'Eastern Africa': 'África Oriental',
  'Northern Africa': 'África Setentrional',
  'Southern Africa': 'África Austral',

  'North America': 'América do Norte',
  'Central America': 'América Central',
  'South America': 'América do Sul',
  Caribbean: 'Caribe',

  'Central Asia': 'Ásia Central',
  'Eastern Asia': 'Ásia Oriental',
  'South-Eastern Asia': 'Sudeste Asiático',
  'Southern Asia': 'Sul da Ásia',
  'Western Asia': 'Oeste da Ásia',

  'Northern Europe': 'Europa Setentrional',
  'Western Europe': 'Europa Ocidental',
  'Southern Europe': 'Europa Meridional',
  'Eastern Europe': 'Europa Oriental',

  'Australia and New Zealand': 'Austrália e Nova Zelândia',
  Melanesia: 'Melanésia',
  Micronesia: 'Micronésia',
  Polynesia: 'Polinésia'
};

export function translateRegion(region: string | null | undefined): string {
  if (!region) {
    return 'N/A';
  }

  return REGIONS[region] || region;
}

export function translateSubregion(subregion: string | null | undefined): string {
  if (!subregion) {
    return 'N/A';
  }

  return SUBREGIONS[subregion] || subregion;
}