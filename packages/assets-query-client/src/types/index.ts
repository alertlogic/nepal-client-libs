import {
    HealthAssetVPC,
    HealthAssetRemediation,
    HealthAssetDeployment,
    HealthAssetHost,
    HealthAssetAppliance,
    HealthAssetAgent,
    HealthListItem,
    HealthResponseFilters
} from './health-assets';

export * from './assets';
export {
    HealthAssetVPC,
    HealthAssetRemediation,
    HealthAssetDeployment,
    HealthAssetAppliance,
    HealthAssetAgent,
    HealthAssetHost,
    HealthListItem,
    HealthAssetStatisticCounts,
    HealthAssetDeploymentType,
    HealthAssetHealthLevel,
    HealthAssetProtectionPolicy,
    HealthAssetCategory,
    HealthResponseFilters
} from './health-assets';

export interface HealthResponse {
    assets?: {
        [key: string]: HealthAssetVPC |
                       HealthAssetRemediation  |
                       HealthAssetDeployment |
                       HealthAssetAppliance |
                       HealthAssetAgent |
                       HealthAssetHost
    };
    filters?: HealthResponseFilters;
    list?: HealthListItem[];
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
    all?: number;
    high?: number;
    info?: number;
    low?: number;
    medium?: number;
}
export interface ExposuresSummary {
    exposures: ExposuresDeploymentSummary[];
    summary: ThreatSummary;
}
export interface ExposuresDeploymentSummary {
    account_id: string;
    asset_count: number;
    deployment_id: string;
    key: string;
    name: string;
    p90_severity: number;
    raw_severity: number;
    severity: number;
    summary: ThreatSummary;
    threatiness: number;
    tri: number;
    type: string;
}
export interface ExposureQueryParams {
    details?: boolean;
    filter?: string | string[];
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
    remediations?: ExposureQueryResults;
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
    account_id?: string;
    asset_count?: number;
    categories?: string[];
    cve?: string;
    cvss_score?: number;
    cvss_vector?: string;
    deployment_ids?: string[];
    external?: boolean;
    name?: string;
    remediation_count?: number;
    remediation_id?: string;
    remediations?: ExposureRemediationItem[];
    severities?: ThreatSummary;
    severity?: string;
    tags?: any;
    threat_level?: number;
    threat_pct?: number;
    threat_score?: number;
    threat_vector?: string;
    threatiness?: number;
    type?: string;
    vinstances_count?: number;
    vinstances?: ExposureVInstanceItem[];
    vulnerabilities?: ExposureVulnerabilityItem[];
    vulnerability_count?: string;
    vulnerability_id?: string;
}
export interface ExposureRemediationItem {
    account_id?: string;
    name?: string;
    remediation_id?: string;
    tags?: any;
    target_asset_type?: string;
    threat_level?: number;
    threatiness?: number;
    type?: string;
}
export interface ExposureVulnerabilityItem {
    account_id?: string;
    asset_count?: number;
    categories?: string[];
    cvss_score?: number;
    external?: boolean;
    name?: string;
    remediation_id?: string;
    severity?: string;
    tags?: any;
    threat_level?: number;
    threat_score?: number;
    threatiness?: number;
    type?: string;
    vulnerability_id?: string;
}
export interface ExposureVInstanceItem {
    categories?: string[];
    concluded?: boolean;
    details?: string;
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
