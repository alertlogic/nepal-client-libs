import { AlChangeStamp } from "@al/client";
export interface TableauReportDefinition {
    site_id?: string;
    workbook_id?: string;
    view_id?: string;
    saved_view_id?: string;
    format?: string;
    filter_values?: unknown;
}

export interface CargoReportTimeRange {
    days?: number;
    hours?: number;
    minutes?: number;
}

export interface SearchReportDefinition {
    saved_query_id: string;
    timerange?: CargoReportTimeRange;
}

export interface CreateReportRequest {
    name: string;
    type: string;
    definition: SearchReportDefinition | TableauReportDefinition;
    schedule?: string;
    is_active?: boolean;
    per_accounts_id?: string[];
}

export interface ReportScheduleRequest {
    report_id: string;
    scheduled_time?: string;
    sub_results?: {
        account_id: string;
    }[];
}

export interface ExecutionRecord {
    schedule_id: string;
    scheduled_time?: number;
}

export interface ReportScheduleOnceRequest {
    name: string;
    type: 'search'|'tableau';
    definition: SearchReportDefinition | TableauReportDefinition;
    per_account_ids?: string[];
    notify_behavior?: 'always'|'never'|'ifnotempty';
    delete_empty_result?: boolean;
}

export interface ListScheduledReportsQueryParams {
    limit?: number;
    order?: string;
    report_id?: string;
    report_type?: string;
    continuation?: string;
}

export interface CargoReport {
    id: string;
    name: string;
    status?: 'scheduled' | 'running' | 'cancelled' | 'completed';
    schedule?: string;
    schedule_display_name?: string;
    scheduled_time?: number;
    create_time?: number;
    type?: string;
    definition?: SearchReportDefinition|TableauReportDefinition;
    subkey?: string;
    sub_results?: [{
        account_id: string;
        status: 'ok' | 'error';
        result_id: string;
        is_reference: boolean;
    }];
    notify_behaviour?: string;
    delete_empty_result?: boolean;
    per_account_ids?: string[];
    latest_schedule?: number;
    is_active?: boolean;
    report_id?: string;
}

export interface CargoScheduledReportResponse {
    account_id: string;
    scheduled_report: CargoReport;
}

export interface CargoScheduledReportListResponse {
    account_id: string;
    continuation: string;
    scheduled_reports: CargoReport[];
}

export interface ReportSchedule {
    id?: string;
    name?: string;
    type?: string;
    definition?: SearchReportDefinition|TableauReportDefinition;
    schedule?: {
        every_15_minutes?: CargoReportTimeRange;
        daily?: CargoReportTimeRange;
        weekly?: CargoReportTimeRange;
        monthly?: CargoReportTimeRange;
    };
    is_active?: boolean;
    notify_behavior?: string;
    delete_empty_result?: boolean;
    created?: AlChangeStamp
    modified?: AlChangeStamp
}

export interface ReportSchedules {
    account_id: string;
    schedules: ReportSchedule[];
}

export interface ReportArtifact {
    result_id?: string;
    is_rerference?: boolean;
}

export interface ReportExecutionRecord {
    id: string;
    account_id?: string;
    schedule_id?: string;
    name?: string;
    status?: 'scheduled' | 'running' | 'cancelled' | 'completed' | 'failed';
    type?: string;
    definition?: SearchReportDefinition|TableauReportDefinition;
    schedule?: ReportSchedule;
    scheduled_time?: number;
    subkey?: string;
    artifact_data?: ReportArtifact;
    notify_behaviour?: string;
    delete_empty_result?: boolean;
    create_time?: number;
    run_once?: boolean;
}

export interface ReportExecutionRecords {
    account_id: string;
    continuation: string;
    execution_records: ReportExecutionRecord[];
}
