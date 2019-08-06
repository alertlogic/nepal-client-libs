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

export interface ThreatSummary {
  medium?: number;
  low?: number;
  info?: number;
  high?: number;
  all?: number;
}

export interface ExposuresSummary {
  exposures: ExposuresDeploymentSummary[];
  summary: ThreatSummary;
}

export interface ExposuresDeploymentSummary {
  type: string;
  tri: number;
  threatiness: number;
  summary: ThreatSummary;
  severity: number;
  raw_severity: number;
  p90_severity: number;
  name: string;
  key: string;
  deployment_id: string;
  asset_count: number;
  account_id: string;
}

export interface ExposureQueryParams {
  details?: boolean;
  filter?: string;
  group?: 'exposure' | 'remediation' | 'asset';
  include_exposures?: boolean;
  include_filters?: boolean;
  include_remediations?: boolean;
  include_remediation_items?: boolean;
  sort?: string;
  limit?: number;
  scope?: boolean;
}

export interface ExposuresQueryResponse {
  summary?: {
    severities?: ThreatSummary;
  };
  filters?: ExposuresQueryFilter[];
  exposures?: ExposureQueryResults;
  redmediations?: ExposureQueryResults;
}

export interface ExposuresQueryFilter {
  account_id?: string;
  deployment_id?: string;
  deployment_name?: string;
  key?: string;
  name?: string;
  threat_level?: number;
  threatiness?: number;
  type?: string;
}

export interface ExposureQueryResults {
  rows?: number;
  assets?: ExposureQueryResultItem[];
}

export interface ExposureQueryResultItem {
  vulnerability_id?: string;
  vulnerability_count?: string;
  vulnerabilities?: ExposureVulnerabilityItem[];
  vinstances?: ExposureVInstanceItem[];
  type?: string;
  threatiness?: number;
  threat_vector?: string;
  threat_score?: number;
  threat_pct?: number;
  threat_level?: number;
  tags?: any;
  severity?: string;
  severities?: ThreatSummary;
  remediations?: ExposureRemediationItem[];
  remediation_id?: string;
  remediation_count?: number;
  name?: string;
  external?: boolean;
  deployment_ids?: string[];
  cvss_vector?: string;
  cvss_score?: number;
  categories?: string[];
  asset_count?: number;
  account_id?: string;
}

export interface ExposureRemediationItem {
  type?: string;
  threatiness?: number;
  threat_level?: number;
  target_asset_type?: string;
  tags?: any;
  remediation_id?: string;
  name?: string;
  account_id?: string;
}

export interface ExposureVulnerabilityItem {
  vulnerability_id?: string;
  type?: string;
  threatiness?: number;
  threat_score?: number;
  threat_level?: number;
  tags?: any;
  severity?: string;
  remediation_id?: string;
  name?: string;
  external?: boolean;
  cvss_score?: number;
  categories?: string[];
  asset_count?: number;
  account_id?: string;
}

export interface ExposureVInstanceItem {
  categories?: string[];
  details?: string;
  concluded?: boolean;
  disposed?: boolean;
  key?: string;
  modified_on?: number;
  target?: ExposureVInstanceTarget;
  threatiness?: number;
}

export interface ExposureVInstanceTarget {
  account_id?: string;
  deployment_id?: string;
  dns_name?: string;
  key?: string;
  name?: string;
  scheme?: string;
  tags?: any;
  threat_level?: number;
  threatiness?: number;
  type?: string;
}
