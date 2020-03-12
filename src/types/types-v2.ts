/**
 * Cargo API V2
 */
import { AlChangeStamp } from "@al/client";

export interface CargoReportTimeRangeV2 {
  days?: number;
  hours?: number;
  minutes?: number;
}

export interface CargoReportWeeklyScheduleV2 {
  day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
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

export interface TableauReportDefinitionV2 {
  site_id?: string;
  workbook_id?: string;
  view_id?: string;
  saved_view_id?: string;
  format?: string;
  filter_values?: { [key: string]: string[] };
}

export interface SearchReportDefinitionV2 {
  saved_query_id: string;
  timerange?: CargoReportTimeRangeV2;
}

export interface ExecutionRecordV2 {
  schedule_id: string;
  scheduled_time?: number;
}

export interface ExecutionRecordOnceRequestV2 {
  name: string;
  type: 'search' | 'tableau';
  definition: SearchReportDefinitionV2 | TableauReportDefinitionV2;
  schedule_id?: string;
  notify_behavior?: 'always' | 'never' | 'ifnotempty';
  delete_empty_result?: boolean;
}

export interface ScheduledReportRequestV2 {
  name?: string;
  type?: string;
  definition?: SearchReportDefinitionV2 | TableauReportDefinitionV2;
  schedule?: 'every_15_minutes' | {
    daily?: CargoReportDailyScheduleV2;
    weekly?: CargoReportWeeklyScheduleV2;
    monthly?: CargoReportMonthlyScheduleV2;
  };
  is_active?: boolean;
  notify_behavior?: string;
  delete_empty_result?: boolean;
}

export interface ScheduledReportResponseV2 extends ScheduledReportRequestV2 {
  id: string;
  created?: AlChangeStamp;
  modified?: AlChangeStamp;
}

export interface ScheduledReportListV2 {
  account_id: string;
  schedules: ScheduledReportResponseV2[];
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
  schedule?: 'every_15_minutes' | {
    daily?: CargoReportDailyScheduleV2;
    weekly?: CargoReportWeeklyScheduleV2;
    monthly?: CargoReportMonthlyScheduleV2;
  };
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

export interface ExecutionRecordsQueryParamsV2 {
  limit?: number;
  order?: 'asc' | 'desc';
  schedule_id?: string;
  type?: 'search' | 'tableau';
  continuation?: string;
}
