import { Scope } from './assets';

import {
    HealthAssetVPC,
    HealthAssetRemediation,
    HealthAssetDeployment,
    HealthAssetHost,
    HealthAssetAppliance,
    HealthAssetAgent,
    HealthListItem,
    HealthResponseFilters,
    HealthAssetCollector
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
    HealthAssetCollector,
    HealthResponseFilters,
    HealthAssetExposure
} from './health-assets';

export * from './health-assets';

export interface HealthResponse {
    assets?: {
        [key: string]: HealthAssetVPC | HealthAssetRemediation | HealthAssetDeployment | HealthAssetAppliance | HealthAssetAgent | HealthAssetHost | HealthAssetCollector;
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
    collectors?: {
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
    tags?: {
        assets: string[][];
        rows: number;
        data: {
            [key: string]: TaggedAssetData
        };
    };
}
export interface TaggedAssetData {
    deployment_ids?: string[];
    key: string;
    name: string;
    tag_key?: string;
    tag_value?: string;
    type: string;
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
    deployment_id?: string;
    details?: boolean;
    basic_details?: boolean;
    filter?: string | string[];
    group?: 'exposure' | 'remediation' | 'asset';
    include_exposures?: boolean;
    include_filters?: boolean;
    include_remediations?: boolean;
    include_remediation_items?: boolean;
    sort?: string;
    limit?: number;
    scope?: boolean;
    concluded?: boolean;
    disposed?: boolean;
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
    vinstances_count?: number;
}
export interface ExposureQueryResults {
    rows?: number;
    assets?: ExposureQueryResultItem[];
}
export interface ExposureQueryResultItem {
    account_id?: string;
    asset_count?: number;
    categories?: string[];
    created_on?: number;
    cve?: string;
    cwe?: string;
    cvss_score?: number;
    cvss_vector?: string;
    deployment_id?: string;
    deployment_ids?: string[];
    exposures?: ExposureQueryResultItem[];
    exposures_count?: number;
    external?: boolean;
    modified_on?: number;
    name?: string;
    remediation_count?: number;
    remediation_id?: string;
    remediations?: ExposureRemediationItem[];
    severities?: ThreatSummary;
    severity?: string;
    tags?: any;
    target_asset_type?: string;
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
    remediation_item_id?: string;
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
    created_on?: number;
    modified_on?: number;
}
export interface CollectionHealthQueryParams {
    scope?: boolean;
    filter?: string[];
    disposed?: 'true' | 'false' | 'all';
    concluded?: 'true' | 'false' | 'all';
}
export interface RemediationItemsQueryParams {
    deployment_ids?: string;
    remediation_item_ids?: string;
    state?: string;
    filter?: string | string[];
    include_exposures?: boolean;
    include_filters?: boolean;
    detailed_filters?: boolean;
    details?: boolean;
    group_by_audit_id?: boolean;
    audit_ids?: string;
    remediation_ids?: string;
    vulnerability_ids?: string;
    basic_details?: boolean;
}
export interface RemediationItemsQueryResponse {
    filters?: string[] | RemediationItemsFilter[];
    'remediation-items'?: RemediationItemsQueryResult;
    summary?: {
        severities?: ThreatSummary;
    };
}
export interface RemediationItemsFilter {
    type: string;
    name: string;
    key: string;
    count: number;
}

export interface BasicVulnerability {
    categories?: string[];
    name?: string;
    severity?: string;
    threat_score?: number;
    type?: string;
    vulnerability_id?: string;
}

export interface RemediationItemAsset {
    account_id?: string;
    applies_to_specific_assets?: boolean;
    asset_count?: number;
    audit_id?: string;
    created_on?: number;
    deployment_id?: string;
    deployment_ids?: string[];
    comment?: string;
    expires?: number;
    exposures?: ExposureQueryResultItem[];
    exposures_count?: number;
    filter_match_mode?: string;
    filters?: string[];
    item_id?: string;
    item_ids?: string[];
    key?: string;
    keys?: string[];
    modified_on?: number;
    reason?: string;
    remediation?: {
        account_id?: number;
        categories?: string[];
        created_on?: number;
        deployment_id?: string;
        key?: string;
        modified_on?: number;
        name?: string;
        remediation_id?: string;
        tags: any;
        target_asset_type?: string;
        threat_level?: number;
        threatiness?: number;
        type?: string;
    };
    remediation_id?: string;
    severities?: ThreatSummary;
    state?: string;
    tags?: any;
    threat_level?: number;
    threatiness?: number;
    type?: string;
    user_id?: string;
    vinstances_count?: number;
    vulnerability_id?: string;
    vulnerability?: BasicVulnerability;
}
export interface RemediationItemsQueryResult {
    assets?: RemediationItemAsset[];
    rows?: number;
}
export interface AssetsQueryParams {
    asset_types?: string;
    return_types?: string;
    query_format?: string;
    return_count?: boolean;
    reduce?: boolean;
    qfields?: string;
    [key: string]: any;
}
export interface AssetQueryGeneralResponse {
    assets: AssetQueryResultItem[] |  AssetQueryResultItem[][];
    rows: number;
}
export interface AssetQueryResultItem {
    account_id?: string;
    created_on?: number;
    criticality?: number;
    declared?: boolean;
    deleted_on?: number;
    deployment_id?: string;
    deployment_type?: string;
    description?: string;
    group_id?: string;
    group_name?: string;
    groups?: string[];
    groups_match?: 'any' | 'all';
    in_scope?: boolean;
    key?: string;
    membership_counts?: {
        [property: string]: number;
    };
    modified_on?: number;
    name?: string;
    native_type?: string;
    path?: string[];
    refreshed_on?: number;
    scope_aws_group_description?: string;
    scope_aws_group_id?: string;
    scope_aws_group_name?: string;
    scope_aws_native_id?: string;
    scope_aws_vpc_id?: string;
    scopes?: Scope[];
    statistics?: AssetQueryResultStatistics;
    status?: string;
    statuses?: {[i: string]: AssetQueryResultItemStatus};
    tag_keys?: {
        [key: string]: string;
    };
    tags?: {
        [key: string]: string;
    };
    threat_level?: number;
    threatiness?: number;
    type?: string;
    version?: number;
    alertlogic_agent?: boolean;
    related_properties?: unknown;
    alertlogic_appliance?: boolean;
    host_uuid?: string;
    protection_policy_id?: string;
    protection_policy_name?: string;
    /** 0 for healthy and 2 for unhealthy */
    health_level?: 0 | 2;
    /** An object mapping exposure severity to open security exposure count  */
    security_exposure_summary?: {total: number; critial: number; high: number; medium: number; low:number; info: number};
    /** A string containing the highest severity for open security exposures on the asset */
    security_exposure_severity?: 'critial' | 'high' | 'medium' | 'low' | 'info';
    /** A number containing the aggregated threatiness for open security exposures */
    security_threatiness?: number;
    /** An object mapping exposure severity to open health exposure count */
    health_exposure_summary?: { total: number; medium: number; low: number; info: number; high: number; critical: number; };
    /** A string containing the highest severity for open health exposures on the asset */
    health_exposure_severity?: 'critial' | 'high' | 'medium' | 'low' | 'info';
    /** A number containing the aggregated threatiness for open health exposures */
    health_threatiness?: number;
}

export interface AssetQueryResultStatistics {
    bytes_ids?: AssetQueryResultStatisticsDetails;
    bytes_log?: AssetQueryResultStatisticsDetails;
    messages_log?: AssetQueryResultStatisticsDetails;
    packets_ids?: AssetQueryResultStatisticsDetails;
}

export interface AssetQueryResultStatisticsDetails {
    hours?: unknown;
    last_day?: number;
    last_hour?: number;
}

export interface AssetQueryResultItemStatus {
    type?: string;
    timestamp?: number;
    stream?: string;
    condition?: string;
    application?: string;
    metadata?: {[i: string] : unknown};
    reasons?: unknown;
}

export interface FoundAsset {
    type?: string;
    key?: string;
    deployment_id?: string;
    host_key?: string;
    [key: string]: string;
}

export type GenericResponse = { [key: string]: unknown };

export interface RemediationsItemsListResponse {
    assets?: GenericResponse[];
    rows?: number;
}

export interface UndisposeRemediationsRequestBody {
    operation?: string;
    filters?: string[];
    audit_ids?: string[];
    deployment_ids?: string[];
    vulnerability_ids?: string[];
    remediation_ids?: string[];
    remediation_item_ids?: string[];
}

export interface AssetWriteNetworkProperties {
    network_name: string;
    cidr_ranges: string[];
    public_cidr_ranges: string[];
}

export interface AssetWriteNetworkRequestBody {
    operation: 'create_network'; // allowed values will be extended later
    scope: 'datacenter'; // allowed values will be extended later
    properties?: AssetWriteNetworkProperties;
}

export interface AssetWriteDeclareAssetRequestBody {
    operation: 'declare_asset' | 'remove_asset';
    type: string;
    scope: string;
    key: string;
    properties?: { [property: string]: any };
    relationships?: AssetWriteDeclareAssetRelationship[];
    exclusive?: string;
    exclusive_types?: string[];
}

export interface AssetWriteDeclareAssetRelationship {
    type: string;
    key: string;
    relationship_type?: string;
}

export interface AssetWriteDeclareAssetResponse {
    account_id: string;
    deployment_id: string;
    key: string;
    type: string;
    relationships?: AssetWriteDeclareAssetRelationship;
    [i: string]: any;
}

export interface AssetWriteDeletePropertiesRequestBody {
    operation: 'remove_properties';
    type: string;
    scope: string;
    key: string;
    property_names: string[];
}

export interface AssetWriteDeletePropertiesResponse {
    account_id: string;
    deployment_id: string;
    key: string;
    type: string;
}

export interface AssetsQueryIncidentIdsPayload {
    assets: {
        deployment_id: string;
        key: string;
        type: string;
    }[];
    limit: number;
}

export interface AssetsQueryIncidentIdsResponse {
    [key: string]: string[];
}
