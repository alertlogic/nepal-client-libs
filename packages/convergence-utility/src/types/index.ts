
import { AlChangeStamp } from '@al/core';

export type LookedUpUsersResponse = { users: {[id: string]: UserData }  };

export type CollectionFiltersResponse = { filters: CollectionFilter[] };

export type CollectionFilterValue = ICollectionFilterValue | string;

export type CollectionSourceMetadata = {[i: string]: string};

export interface CloudExplorerAwsRegionRecord {
    id: string;
    name: string;
}

export interface CollectionResponse {
    sources: CollectionSource[];
    total_count?: number;
}

export interface CollectionSource {
    source: CollectionSourceValue;
    is_archived: boolean;
}

export interface CollectionSourceValue {
    collection_alerts?: string[];
    config?: CollectionSourceConfig;
    created?: AlChangeStamp;
    modified?: AlChangeStamp;
    customer?: { id: string };
    enabled?: boolean;
    host?: {id: string};
    appliance?: any[];
    id?: string;
    name?: string;
    product_type?: string;
    stats?: {[k: string]: number};
    status?: CollectionSourceStatus;
    tags?: {name: string}[];
    type?: string;
    metadata?: CollectionSourceMetadata;
}

export interface CollectionSourceStatus {
    details: any[];
    status: string;
    timestamp: number;
    updated: number;
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



