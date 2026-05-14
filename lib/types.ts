export type DataCoverage = "national_cpi" | "direct_metro_cpi" | "regional_proxy_cpi" | "national_proxy_cpi";

export type Metro = {
  slug: string;
  display_name: string;
  full_name: string;
  state_or_region: string;
  page_type: "national" | "metro";
  data_coverage: DataCoverage;
  cpi_series_id: string;
  wage_series_id: string;
  fallback_cpi_slug: string | null;
  nearby: string[];
  oil_exposure?: {
    driving_multiplier: number;
    heating_fuel_multiplier: number;
    transit_offset: number;
    overall_oil_exposure_multiplier: number;
    note: string;
  };
};

export type CpiPoint = { year: number; index: number };
export type WagePoint = { year: number; wage: number };
export type OilPricePoint = { year: number; price: number };

export type FutureScenario = {
  label: "Low" | "Baseline" | "High";
  annualRate: number;
  value: number;
};
