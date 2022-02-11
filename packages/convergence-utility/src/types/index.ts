
import { AlChangeStamp } from '@al/core';

export type PolicyType = 'eventlogs' | 's3' | 'flatfile';

export type LookedUpUsersResponse = { users: { [id: string]: UserData } };

export type CollectionFiltersResponse = { filters: CollectionFilter[] };

export type CollectionFilterValue = ICollectionFilterValue | string;

export type CollectionSourceMetadata = { [i: string]: string };

export interface CloudExplorerAwsRegionRecord {
    id: string;
    name: string;
}

export interface CollectionsGenericResponse {
    credentials?: CollectionCredential;
    policies?: CollectionPolicy[];
    sources?: CollectionSource[];
    collectors?: CollectionSource[];
    hosts?: CollectionSource[];
    total_count?: number;
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
}

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
    customer?: { id: string };
    enabled?: boolean;
    host?: { id: string, ip_address?: string };
    appliance?: any;
    id?: string;
    name?: string;
    product_type?: string;
    stats?: { [k: string]: number };
    status?: CollectionSourceStatus;
    tags?: { name: string }[];
    type?: string;
    metadata?: CollectionSourceMetadata;
    assignmentPolicy?: { id: string };
    update_policy?: any;
}

export interface CollectionSourceStatus {
    details?: any[];
    status?: string;
    timestamp?: number;
    updated?: number;
}

export interface CollectionSourceConfig {
    collection_method?: string;
    collection_type?: string;
    policy?: {
        id: string | null,
        name: string
    };
    time_zone?: string;
    [property: string]: any;
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



