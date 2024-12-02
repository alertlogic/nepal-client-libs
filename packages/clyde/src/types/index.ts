export type CollectionType = "master" | "updater" | "eventlog" | "syslog" | "flatfile" | "tmhost" | "tmappliance" | "scanappliance";
export type CollectionMethod = "agent" | "appliance";

export interface MinVersionQueryParams {
    min_version?: string;
    collection_method?: CollectionMethod;
    collection_type?:  CollectionType;
}

export interface GetMinVersionResponse {
    ok_count: number;
    ok_percent?: number;
    outdated_clients?: unknown[];
    outdated_count?: number;
    outdated_error_count?: number;
    outdated_error_percent?: number;
    outdated_in_progress_count?: number;
    outdated_in_progress_percent?: number;
    outdated_not_started_count?: number;
    outdated_not_started_percent?: number;
    outdated_percent?: number;
    result: "ok" | "outdated" | "error";
    total_online_count?: number;
}

export interface MinVersionPayload {
    collection_type?: CollectionType;
    collection_method?: CollectionMethod;
    min_version: string;
    required?: boolean;
}

export interface SetMinVersionResponse {
    details?: string;
    result: 'ok' | 'error';
}
