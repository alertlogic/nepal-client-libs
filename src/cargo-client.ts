/**
 * Module to deal with available Cargo Public API endpoints
 */
import { ALClient, APIRequestParams } from '@alertlogic/client';

export interface TableauReportDefinition {
  site_id: string;
  workbook_id: string;
  view_id: string;
  saved_view_id: string;
}

export interface ReportTimeRange {
  days: number;
  hours: number;
  minutes: number;
}

export interface SearchReportDefinition {
  saved_query_id: string;
  timerange: ReportTimeRange;
}

export interface CreateReportRequest {
  name: string;
  type: 'search' | 'tableau';
  definition: TableauReportDefinition;
  schedule: string;
  is_active: boolean;
  per_accounts_id: string[];
}

export interface ReportScheduleRequest {
  report_id: string;
  scheduled_time: string;
  sub_results: {
    account_id: string;
  }[];
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
    return result;
  }
  /**
   * Get report for given account_id and report_id
   */
  async getReport(accountId: string, reportId: string) {
    const reports = await this.alClient.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/reports/${reportId}`,
    });
    return reports;
  }
  /**
   * Update one or several properties of existing report for given account_id and report_id
   */
  async updateReport(accountId: string, reportId: string, reportRequest: CreateReportRequest) {
    const reports = await this.alClient.set({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/reports/${reportId}`,
      data: reportRequest,
    });
    return reports;
  }
  /**
   * Remove report for given account_id and report_id
   */
  async removeReport(accountId: string, reportId: string) {
    const reports = await this.alClient.delete({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/deployments/${reportId}`,
    });
    return reports;
  }
  /**
   * Get list of reports for given account_id
   */
  async listReports(accountId: string, queryParams?: any) {
    const apiRequestParams: APIRequestParams = {
      service_name: this.serviceName,
      account_id: accountId,
      path: '/report',
    };
    if (queryParams) {
      apiRequestParams.params = queryParams;
    }
    const reports = await this.alClient.fetch(apiRequestParams);
    return reports;
  }
  /**
   * Scheduled report for given account_id
   */
  async scheduleReport(accountId: string, scheduleReportRequest: ReportScheduleRequest) {
    const result = await this.alClient.delete({
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
    return report;
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
}

export const cargoClient =  new CargoClient();
