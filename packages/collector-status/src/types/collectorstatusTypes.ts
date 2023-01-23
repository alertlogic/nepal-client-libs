
import { AlChangeStamp } from '@al/core';

export type StreamType = "offline" | "tmhost" | "syslog" | "tmappliance" | "update" | "updater" | "undefined" | "default";
export type Status = "new" | "offline" | "ok" | "error" | "warning";
type GroupBy = 'host_id' | 'stream' | 'source_id' | 'collection_type';

export interface AlCollectorStatusObject {
    timestamp: number;
    account_id?: string;
    status_id?: string;
    stream?: StreamType;
    status?: Status;
    reported_by?: string;
    inst_type?: string;
    details?: string[];
    source_id?: string;
    stream_type?: string;
    stream_name?: string;
    status_type?: string;
    message_type?: string;
    host_uuid?: string;
    data?: { [key: string]: string }[];
    collection_type?: string;
    agent_type?: string;
    source_uuid?: string;
    type?: string;
    status_key?: string;
    reasons?: unknown[];
    metadata?: unknown;
    condition?: string;
    application?: string;
    errorinfo?: { details: { [key: string]: string }[]; description: string; code: string };
}

export interface AlCollectorStatusHistoryResponse {
    rows: number;
    status_id: string;
    statuses: Array<AlCollectorStatusObject>;
}

export interface AlCollectorStatusQueryParams {
    adapter?: 'ingest' | 'assets' | 'sources';
    group_by?: GroupBy;
    limit?: number; // default is 10
    from_ts?: number;
    until_ts?: number;
    aggregation_policy: string; // worst_status
}
