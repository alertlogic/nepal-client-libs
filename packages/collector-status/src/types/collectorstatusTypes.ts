
import { AlChangeStamp } from '@al/core';

export type StreamType = "offline" | "tmhost" | "syslog" | "tmappliance" | "update" | "updater" | "undefined" | "default";
export type Status = "ok" | "error" | "warning";
type GroupBy = 'host_id' | 'stream' | 'source_id' | 'collection_type';

export interface AlCollectorStatusObject {
    account_id: string;
    status_id:	string;
    stream: StreamType;
    status:	Status;
    timestamp: number;
    reported?: AlChangeStamp;
    details?: string[];
}

export interface AlCollectorStatusHistoryResponse {
    rows: number;
    status_id: string;
    statuses: Array<AlCollectorStatusObject>;
}

export interface AlCollectorStatusQueryParams {
    group_by?: GroupBy;
    limit?: number; // default is 1000
    timestamp?: number;
    timestamp_type?: 's' | 'ms' | 'seconds' | 'miliseconds';
    aggregation_policy: string; // worst_status
}
