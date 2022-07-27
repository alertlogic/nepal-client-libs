export interface ScanStatusSummary {
    summary: {
        total?: number;
        in_scope?: number;
        excluded?: number;
        running?: number;
        scanned?: number;
        scannable?: number;
    };
}

export interface ScanTarget {
    id?: string;
    type?: string;
    policy?: {
        ports?: number[];
        credentials?: any;
    };
    subnet?: string;
    address?: string;
    name?: string;
    vpc?: string;
    metadata?: {
        request_id: string;
        status?: string;
        excluded?: boolean,
        last_scan?: number;
        last_heartbeat?: number;
        launch_time?: number;
        priority?: number;
    };
}
