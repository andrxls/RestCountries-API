export interface CountryNameTranslation {
  common: string;
  official: string;
}

export interface Country {
  names: {
    common: string;
    official: string;
    alternates?: string[];
    translations?: {
      por?: CountryNameTranslation;
    };
  };
  codes: {
    alpha_3: string;
  };
  capitals?: Array<{ name: string }>;
  flag?: {
    description?: string;
    url_png?: string;
    url_svg?: string;
  };
  region?: string;
  subregion?: string;
  population?: number;
  area?: {
    kilometers?: number;
    miles?: number;
  };
  coordinates?: {
    lat?: number;
    lng?: number;
  };
  languages?: Array<{ name: string }>;
  currencies?: Array<{ name: string }>;
  timezones?: string[];
  tlds?: string[];
  calling_codes?: string[];
}
