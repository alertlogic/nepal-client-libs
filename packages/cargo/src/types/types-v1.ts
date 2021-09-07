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
  notify_behavior?: string;
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
