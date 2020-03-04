/**
 * Module to deal with available Cargo Public API endpoints
 */
import { ALClient, AlApiClient, APIRequestParams } from '@al/client';
import {
    CreateReportRequest,
    ReportScheduleRequest,
    ReportScheduleOnceRequest,
    ListScheduledReportsQueryParams,
    CargoReport,
    CargoScheduledReportListResponse,
    CreateReportResponse,
    CargoReportResponse,
    CargoReportListResponse,
} from './types';

export class AlCargoClientInstance {

  protected serviceName = 'cargo';

  constructor( public client:AlApiClient = ALClient ) {
  }

  /**
   * Create report for given account_id
   */
  async createReport(accountId: string, reportRequest: CreateReportRequest) {
    const result = await this.client.post({
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
    const result = await this.client.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/report/${reportId}`,
    });
    return result as CargoReportResponse;
  }
  /**
   * Update one or several properties of existing report for given account_id and report_id
   */
  async updateReport(accountId: string, reportId: string, reportRequest: CreateReportRequest) {
    const report = await this.client.post({
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
    const report = await this.client.delete({
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
    const reports = await this.client.fetch({
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
    const result = await this.client.post({
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
    const result = await this.client.post({
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
    const result = await this.client.delete({
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
    const report = await this.client.fetch({
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
    const result = await this.client.fetch({
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
    const result = await this.client.fetch({
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
    const result = await this.client.fetch(requestArgs);
    return result as CargoScheduledReportListResponse;
  }
}
