/**
 * Module to deal with available Cargo Public API endpoints
 */
import { ALClient, APIRequestParams } from '@al/client';

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

class CargoClient {

  private alClient = ALClient;
  private serviceName = 'cargo';

  /**
   * Create report for given account_id
   */
  async createReport(accountId: string, reportRequest: CreateReportRequest) {
    const result = await this.alClient.post({
      service_name: this.serviceName,
      account_id: accountId,
      path: '/report',
      data: reportRequest,
    });
    return result as CreateReportResponse;
  }
  /**
   * Get report for given account_id and report_id
   */
  async getReport(accountId: string, reportId: string) {
    const report = await this.alClient.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/report/${reportId}`,
    });
    return report as CargoReportResponse;
  }
  /**
   * Update one or several properties of existing report for given account_id and report_id
   */
  async updateReport(accountId: string, reportId: string, reportRequest: CreateReportRequest) {
    const report = await this.alClient.post({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/report/${reportId}`,
      data: reportRequest,
    });
    return report;
  }
  /**
   * Remove report for given account_id and report_id
   */
  async removeReport(accountId: string, reportId: string) {
    const report = await this.alClient.delete({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/report/${reportId}`,
    });
    return report;
  }
  /**
   * Get list of reports for given account_id
   */
  async listReports(accountId: string, queryParams: {report_type?: string} = {}) {
    const reports = await this.alClient.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: '/report',
      params: queryParams,
    });
    return reports as CargoReportListResponse;
  }
  /**
   * Scheduled report for given account_id
   */
  async scheduleReport(accountId: string, scheduleReportRequest: ReportScheduleRequest | ReportScheduleOnceRequest) {
    const result = await this.alClient.post({
      service_name: this.serviceName,
      account_id: accountId,
      path: '/scheduled_report',
      data: scheduleReportRequest,
    });
    return result;
  }
  /**
   * Cancel scheduled report for given account_id and scheduled_report_id
   */
  async cancelScheduledReport(accountId: string, scheduleReportId: string) {
    const result = await this.alClient.post({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/scheduled_report/${scheduleReportId}/cancel`,
    });
    return result;
  }
  /**
   * Remove scheduled report for given account_id and scheduled_report_id
   */
  async removeScheduledReport(accountId: string, scheduleReportId: string) {
    const result = await this.alClient.delete({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/scheduled_report/${scheduleReportId}`,
    });
    return result;
  }
  /**
   * Get scheduled report for given account_id and scheduled_report_id
   */
  async getScheduledReport(accountId: string, scheduleReportId: string) {
    const report = await this.alClient.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/scheduled_report/${scheduleReportId}`,
    });
    return report as CargoReport;
  }
  /**
   * Retrieve result data of scheduled report run for given account_id, scheduled_report_id and result_id
   */
  async getScheduledReportResult(accountId: string, scheduleReportId: string, resultId: string) {
    const result = await this.alClient.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/scheduled_report/${scheduleReportId}/result/${resultId}`,
    });
    return result;
  }
  /**
   * Return compressed archive containing completed sub-results of scheduled report run for given account_id and scheduled_report_id
   * Archive will be formatted and compressed as tar.gz
   */
  async getScheduledReportResultArchive(accountId: string, scheduleReportId: string) {
    const result = await this.alClient.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/scheduled_report/${scheduleReportId}/result`,
    });
    return result;
  }
  /**
   * List scheduled reports for given account_id.
   * This method is paginated
   */
  async listScheduledReports(accountId: string, queryParams?: ListScheduledReportsQueryParams) {
    const requestArgs: APIRequestParams = {
      service_name: this.serviceName,
      account_id: accountId,
      path: '/scheduled_report',
    };
    if (queryParams) {
      requestArgs.params = queryParams;
    }
    const result = await this.alClient.fetch(requestArgs);
    return result as CargoScheduledReportListResponse;
  }
}

export const cargoClient =  new CargoClient();
