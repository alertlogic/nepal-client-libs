export interface HealthResponse {
  assets?: any;
  filters?: any;
  list?: any;
}

export interface HealthCoverage {
  protected?: number;
  total?: number;
}

export interface HealthScore {
  count?: number;
  health_level?: number;
  unhealthiness?: number;
}

export interface HealthScores {
  scores?: HealthScore[];
}

export interface HealthSummaryResponse {
  agents?: {
    coverage?: HealthCoverage;
    health?: HealthScores;
  };
  appliances?: {
    coverage?: HealthCoverage;
    health?: HealthScores;
  };
  networks?: {
    coverage?: HealthCoverage;
    health?: HealthScores;
  };
}

export interface FindAssetParams {
  uuid: string;
  collector_type?: string;
}

export interface FindAssetsRequest {
  parameters?: FindAssetParams[];
}

export interface AssetTag {
  key?: string;
  type?: string;
  deployment_id?: string;
  tags?: {
    [index: string]: string;
    nickname?: string;
  };
}

export interface TagsSummaryResponse {
  tags?: AssetTag[];
}

export interface TopologyResponse {
  topology?: {
    assets?: any;
    rows?: number;
  };
  extras?: any;
  image?: any;
}
