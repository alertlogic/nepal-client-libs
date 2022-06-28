
import { AlChangeStamp } from '@al/core';

export type StreamType = "offline" | "tmhost" | "syslog" | "tmappliance" | "update" | "updater" | "undefined" | "default";
export type Status = "ok" | "error" | "warning";

export interface AlCollectorStatusObject {
    account_id: string;
    status_id:	string;
    stream: StreamType;
    status:	Status;
    timestamp: string;
    reported?: AlChangeStamp;
}

export interface AlCollectorStatusHistoryResponse {
    rows: number;
    status_id: string;
    statuses: Array<AlCollectorStatusObject>;
}

export interface AlCollectorStatusQueryParams {
    group_by?: string; // e.g. host_id, stream, source_id, collection_type
    limit?: number; // default is 1000
    timestamp?: number;
    timestamp_type?: 's' | 'ms' | 'seconds' | 'miliseconds';
    aggregation_policy: string; // worst_status
}
