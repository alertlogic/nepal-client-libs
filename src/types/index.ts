import { AlChangeStamp } from "@al/client";

/**
 * Cargo API V1
 */
export interface TableauReportDefinition {
  site_id?: string;
  workbook_id?: string;
  view_id?: string;
  saved_view_id?: string;
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

export interface CreateReportResponse {
  id: string;
}

export interface ReportScheduleRequest {
  report_id: string;
  scheduled_time?: string;
  sub_results?: {
    account_id: string;
  }[];
}

export interface ReportScheduleOnceRequest {
  name: string;
  type: string;
  definition: SearchReportDefinition | TableauReportDefinition;
  per_account_ids?: string[];
  notify_behavior?: string;
  delete_empty_result?: boolean;
}

export interface ListScheduledReportsQueryParams {
  limit?: number;
  order?: string;
  report_id?: string;
  report_type?: string;
  continuation?: string;
}

export interface CargoReportResponse {
  account_id: string;
  report: CargoReport;
}

export interface CargoReportListResponse {
  account_id: string;
  reports: CargoReport[];
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
  definition?: SearchReportDefinition;
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

/**
 * Cargo API V2
 */
export interface TableauReportDefinitionV2 {
    site_id?: string;
    workbook_id?: string;
    view_id?: string;
    saved_view_id?: string;
    format?: string;
    filter_values?: unknown;
}

export interface CargoReportTimeRangeV2 {
    days?: number;
    hours?: number;
    minutes?: number;
}

export interface CargoReportWeeklyScheduleV2 {
    day: "monday"| "tuesday"| "wednesday"| "thursday"| "friday"| "saturday"| "sunday";
    hour: number;
    minute: number;
}

export interface CargoReportDailyScheduleV2 {
    hour: number;
    minute: number;
}

export interface CargoReportMonthlyScheduleV2 {
    day: number;
    hour: number;
    minute: number;
}


export interface SearchReportDefinitionV2 {
    saved_query_id: string;
    timerange?: CargoReportTimeRangeV2;
}

export interface CreateReportRequestV2 {
    name: string;
    type: string;
    definition: SearchReportDefinitionV2 | TableauReportDefinitionV2;
    schedule?: string;
    is_active?: boolean;
    per_accounts_id?: string[];
}

export interface ReportScheduleRequestV2 {
    report_id: string;
    scheduled_time?: string;
    sub_results?: {
        account_id: string;
    }[];
}

export interface ExecutionRecordV2 {
    schedule_id: string;
    scheduled_time?: number;
}

export interface ReportScheduleOnceRequestV2 {
    name: string;
    type: 'search'|'tableau';
    definition: SearchReportDefinitionV2 | TableauReportDefinitionV2;
    per_account_ids?: string[];
    notify_behavior?: 'always'|'never'|'ifnotempty';
    delete_empty_result?: boolean;
}

export interface ListScheduledReportsQueryParamsV2 {
    limit?: number;
    order?: string;
    report_id?: string;
    report_type?: string;
    continuation?: string;
}

export interface CargoReportV2 {
    id: string;
    name: string;
    status?: 'scheduled' | 'running' | 'cancelled' | 'completed';
    schedule?: string;
    schedule_display_name?: string;
    scheduled_time?: number;
    create_time?: number;
    type?: string;
    definition?: SearchReportDefinitionV2 | TableauReportDefinitionV2;
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

export interface CargoScheduledReportResponseV2 {
    account_id: string;
    scheduled_report: CargoReportV2;
}

export interface CargoScheduledReportListResponseV2 {
    account_id: string;
    continuation: string;
    scheduled_reports: CargoReportV2[];
}

export interface ReportSchedulePayloadV2 {
    name?: string;
    type?: string;
    definition?: SearchReportDefinitionV2 | TableauReportDefinitionV2;
    schedule?: {
        every_15_minutes?: CargoReportTimeRangeV2;
        daily?: CargoReportDailyScheduleV2;
        weekly?: CargoReportWeeklyScheduleV2;
        monthly?: CargoReportMonthlyScheduleV2;
    };
    is_active?: boolean;
    notify_behavior?: string;
    delete_empty_result?: boolean;
}

export interface ReportScheduleV2 extends ReportSchedulePayloadV2 {
    id: string;
    created?: AlChangeStamp;
    modified?: AlChangeStamp;
}

export interface ReportSchedulesV2 {
    account_id: string;
    schedules: ReportScheduleV2[];
}

export interface ReportArtifactV2 {
    result_id?: string;
    is_rerference?: boolean;
}

export interface ReportExecutionRecordV2 {
    id: string;
    account_id?: string;
    schedule_id?: string;
    name?: string;
    status?: 'scheduled' | 'running' | 'cancelled' | 'completed' | 'failed';
    type?: string;
    definition?: SearchReportDefinitionV2 | TableauReportDefinitionV2;
    schedule?: ReportScheduleV2;
    scheduled_time?: number;
    subkey?: string;
    artifact_data?: ReportArtifactV2;
    notify_behaviour?: string;
    delete_empty_result?: boolean;
    create_time?: number;
    run_once?: boolean;
}

export interface ReportExecutionRecordsV2 {
    account_id: string;
    continuation: string;
    execution_records: ReportExecutionRecordV2[];
}
