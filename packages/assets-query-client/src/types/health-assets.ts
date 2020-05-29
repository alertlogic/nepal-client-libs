export interface HealthAssetVPC {
    account_id?: string;
    cidr_ranges?: string[];
    deployment_id?: string;
    health_level?: number;
    key?: string;
    name?: string;
    network_uuid?: string;
    tags?: {
        [key: string]: string;
    };
    threat_level?: number;
    threatiness?: number;
    type?: string;
    unhealthiness?: number;
    vpc_id?: string;
    vpc_name?: string;
    created_on?: number;
    modified_on?: number;
}

export interface HealthAssetRemediation {
    account_id?: string;
    appliance_name?: string;
    created_on?: number;
    declared?: boolean;
    deleted_on?: number;
    deployment_id?: string;
    host_uuid?: string;
    key?: string;
    load_indicator?: number;
    modified_on?: number;
    name?: string;
    native_type?: string;
    scope_agent_load_indicator?: number;
    scope_agent_load_indicator_update_ts?: number;
    scope_identity_appliance_name?: string;
    scope_identity_host_uuid?: string;
    // tag_keys?:  {}
    tags?: {
        [key: string]: string;
    };
    threat_level?: number;
    threatiness?: number;
    type?: string;
    version?: number;
}

export interface HealthAssetHost {
    account_id?: string;
    alertlogic_appliance?: boolean;
    deployment_id?: string;
    dns_name?: string;
    health_level?: number;
    instance_id?: string;
    instance_name?: string;
    instance_type?: string;
    ip_address?: string;
    key?: string;
    name?: string;
    private_dns_name?:  string;
    private_ip_address?: string;
    private_ip_addresses?: string[];
    private_ipv4_addresses?: string[];
    private_ipv6_addresses?: string[];
    public_ip_addresses?: string[];
    public_ipv4_addresses?: string[];
    public_ipv6_addresses?: string[];
    last_scan_time?: number;
    launch_time?:number;
    architecture?: string;
    availability_zone?: string;
    state?: string;
    tags?:  {
        [key: string]: string;
    };
    threat_level?: number;
    threatiness?: number;
    type?: string;
    unhealthiness?: number;
    created_on?: number;
    modified_on?: number;
}

export interface HealthAssetAgent {
    account_id: string;
    agent_name?: string;
    created_on?: number;
    declared?: boolean;
    deleted_on?: number;
    deployment_id?: string;
    host_uuid?: string;
    key?: string;
    modified_on?: number;
    name?: string;
    native_type?: string;
    refreshed_on?: number;
    scope_identity_agent_name?: string;
    scope_identity_assigned_to: string;
    scope_identity_connected_to: string;
    scope_identity_host_uuid?: string;
    statistics?:  {
        bytes_id?: HealthAssetStatisticCounts;
        bytes_log?: HealthAssetStatisticCounts;
        messages_log?: HealthAssetStatisticCounts;
        packet_ids?: HealthAssetStatisticCounts;
    };
    status?: string;
    status_updated?: number;
    statuses?: {
        [key:string]: {
            application?: string;
            condition?: string;
            reasons?: {
                [key:string]: {
                    text?: string;
                }
            };
            stream?: string;
            timestamp?: number;
            type?: string;
        }
    };
    // tag_keys?:  {}
    // tags?:  {}
    threat_level?: number;
    threatiness?: number;
    type?: string;
    version?: number;
}

export interface HealthAssetStatisticCounts {
    last_hour?: number;
    last_day?: number;
    hours?: {
        [key:string]: number;
    };
}

export interface HealthAssetAppliance {
    account_id?: string;
    deployment_id?: string;
    key?: string;
    name?: string;
    remediation_id?: string;
    tags?: {
        [key: string]: string;
    };
    target_assset_type?: string;
    threat_level?: number;
    threatiness?: number;
    type?: string;
    created_on?: number;
    modified_on?: number;
}

export interface HealthAssetDeployment {
    account_id?: string;
    created_on?: number;
    daily_tri?: number;
    daily_tri_asset_count?: number;
    daily_tri_last_updated?: number;
    daily_tri_pctile_all?: number;
    daily_tri_pctile_segment?: number;
    daily_tri_severity?: number;
    daily_tri_trend_1w?: number;
    daily_tri_trend_4w?: number;
    daily_tri_trend_13w?: number;
    declared?: boolean;
    deleted_on?: number;
    deployment_id?: string;
    deployment_name?: string;
    deployment_type?: string;
    environment_name?: string;
    environment_type?: string;
    key?: string;
    modified_on?: number;
    name?: string;
    native_type?: string;
    path?: string[];
    scope_datacenter_deployment_id?: string;
    scope_datacenter_deployment_type?: string;
    scope_datacenter_environment_id?: string;
    scope_datacenter_environment_type?: string;
    scope_internal_deployment_id?: string;
    scope_internal_deployment_type?: string;
    scope_internal_environment_id?: string;
    scope_internal_environment_type?: string;
    scope_scores_daily_tri?: number;
    scope_scores_daily_tri_asset_count?: number;
    scope_scores_daily_tri_last_updated?: number;
    scope_scores_daily_tri_pctile_all?: number;
    scope_scores_daily_tri_pctile_segment?: number;
    scope_scores_daily_tri_severity?: number;
    scope_scores_daily_tri_trend_1w?: number;
    scope_scores_daily_tri_trend_4w?: number;
    scope_scores_daily_tri_trend_13w?: number;
    threat_level?: number;
    threatiness?: number;
    type?: string;
    version?: number;
}

export interface HealthAssetDeploymentType {
    key?: string;
    type?: string;
}

export interface HealthAssetHealthLevel {
    key?: number;
    type?: string;
}

export interface HealthAssetProtectionPolicy {
    key?: string;
    type?: string;
}

export interface HealthAssetCategory {
    key?: string;
    type?: string;
}

export interface HealthListItem {
    agent?: string;
    appliance?:  string;
    asset_count?:  number;
    collector?: string;
    deployment?: string;
    health_level?: number;
    host?: string;
    protection_policy_id?:  string;
    remediations?: string[];
    remediations_filters?: string[];
    unhealthiness?: number;
    vpc?: string;
}

export interface HealthResponseFilters {
    [key: string]: {
        count?: number;
        health_level?: number;
        healthiness?: number;
    };
}
