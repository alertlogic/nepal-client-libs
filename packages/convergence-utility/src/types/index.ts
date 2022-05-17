
import { AlChangeStamp } from '@al/core';

export type ConvergenceQueryParams =  { [i: string]: string | number | boolean };

export type PolicyType = 'eventlogs'
                        | 's3'
                        | 'flatfile'
                        | 'assignment'
                        | 'monitoring'
                        | 'host'
                        | 'syslog'
                        | 'updates';

export type LookedUpUsersResponse = { users: { [id: string]: UserData } };

export type CollectionFiltersResponse = { filters: CollectionFilter[] };

export type CollectionFilterValue = ICollectionFilterValue | string;

export type CollectionSourceMetadata = { [i: string]: string };

export type ZoneMembershipResponse = { zoneMembership: ApplianceZoneRecord[] };

export interface CloudExplorerAwsRegionRecord {
    id: string;
    name: string;
}

export interface ApplianceZoneRecord {
    zone_id?: string;
    name?: string;
}

export interface CollectionsGenericResponse {
    credentials?: CollectionCredential[];
    policies?: CollectionPolicy[];
    sources?: CollectionSource[];
    collectors?: CollectionSource[];
    hosts?: CollectionSource[];
    networks?:  CollectionSource[];
    history?: CollectionHistory[];
    updates?: CollectionUpdatesPolicy[];
    total_count?: number;
}

export interface CollectionHistory {
    details?: { [k:string]: string }[];
    host_id?: string;
    inst_type?: string;
    reported_by?: string;
    source_id?: string;
    status?: string;
    stream?: string;
    timestamp?: AlChangeStamp;
    updated?: AlChangeStamp;
}

export interface CollectionCredential {
    created?: AlChangeStamp;
    modified?: AlChangeStamp;
    id?: string;
    name?: string;
    type?: string;
    password?: {
        password: string,
        username: string
    };
    iam_role?: {
        arn: string,
        external_id: string
    };
    azure_shared_key?: {
        account_key: string,
        account_name: string
    };
    azure_ad_user?: {
        active_directory_id: string,
        username: string
    };
}

export interface CollectionPolicy {
    id?: string;
    name?: string;
    type?: string;
    product_type?: string;
    collect_from_discovered?: boolean;
    default?: boolean;
    streams?: any[];
    credential?: any;
    schedule?: any;
    created?: AlChangeStamp;
    modified?: AlChangeStamp;
    template_id: string;
    s3: S3;
    collection_alert?: CollectionAlert;
    flatfile?: FlatFile;
    alert_type?: string;
    target_type?: string;
    monitoring?: any;
}

export interface CollectionUpdatesPolicy extends CollectionPolicy {
    when?: string;
    schedule?: CollectionUpdatesPolicySchedule[];
    timezone?: string;
}

export interface CollectionUpdatesPolicySchedule {
    days?: CollectionUpdatesPolicyScheduleDaysConfig;
    time?: CollectionUpdatesPolicyScheduleTimeConfig;
}

export interface CollectionUpdatesPolicyScheduleDaysConfig {
    how: string;
    weekly?: string[];
    monthly?: number[];
}


export interface CollectionUpdatesPolicyScheduleTimeConfig {
    from: TimeConfig;
    to: TimeConfig;
}

export type TimeConfig = { hour: number, minute: number };

export interface FlatFile {
    filename_integer_pattern?: string;
    filename_timestamp_pattern?: string;
    multiline?: MultilineConfig;
    name?: string;
    path?: string;
    timestamp?: TimestampConfig;
}

export interface CollectionAlert {
    alert_threshold?: number;
    emails?: string[];
    is_enabled?: boolean;
    send_once?: boolean;
    send_threshold?: number;
}

export interface S3 {
    multiline?: MultilineConfig;
    timestamp?: TimestampConfig;
}

export interface MultilineConfig {
    continuation?: string;
    is_multiline?: boolean;
    is_regex?: boolean;
    line_count?: string;
    operator?: string;
    pattern?: string;
}

export interface TimestampConfig {
    format?: string;
    rule?: string;
}

export interface CollectionSource {
    source?: CollectionSourceValue;
    host?: CollectionSourceValue;
    is_archived?: boolean;
}

export interface CollectionSourceValue {
    network_id?: string;
    registered?: boolean;
    role?: boolean;
    collection_alerts?: string[];
    config?: CollectionSourceConfig;
    created?: AlChangeStamp;
    modified?: AlChangeStamp;
    customer?: {
        id: string;
    };
    enabled?: boolean;
    host?: {
        id: string;
        ip_address?: string;
    };
    appliance?: any;
    id?: string;
    name?: string;
    product_type?: string;
    stats?: {
        [k: string]: number;
    };
    status?: CollectionSourceStatus;
    tags?: {
        name: string;
    }[];
    type?: string;
    metadata?: CollectionSourceMetadata;
    assignmentPolicy?: {
        id: string;
    };
    update_policy?: any;
    deployment?: any;
    monitoring?: any;
    timestamp?: AlChangeStamp;
}

export interface CollectionSourceStatus {
    details?: any[];
    status?: string;
    timestamp?: number;
    updated?: number;
}

export interface CollectionSourceConfig {
    collection_method?: string;
    template_id?: string;
    collection_type?: string;
    policy?: {
        id?: string,
        name?: string
    };
    azure_events?: {
        credential?: any,
        filters?: any[],
        subscription_id?: string
    };
    azure_table?: {
        table_name?: string,
        credential?: any
    };
    azure_blob?: {
        app_service_name?: string,
        credential?: any,
        config_type?: string,
        container?: string
    };
    time_zone?: string;
    max_collection_interval?: string;
    s3aws?: any;
    s3?: any;
    tmappliance?: any;
}

export interface UserData {
    customer_name: string;
    email: string;
    first_name: string;
    full_name: string;
    last_name: string;
    user_id: string;
    username: string;
}

export interface CollectionFilter {
    field?: string;
    name: string;
    product: string[];
    type: string;
    values: CollectionFilterValue[];
}

export interface ICollectionFilterValue {
    name?: string;
    product?: string;
    value?: string;
}



