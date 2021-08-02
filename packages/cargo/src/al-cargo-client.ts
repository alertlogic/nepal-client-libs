/**
 * Module to deal with available Cargo Public API endpoints
 */
import {
  AlApiClient,
  AlDefaultClient,
  APIRequestParams,
  AlLocation,
} from '@al/core';
import {
  CargoReport,
  CargoReportListResponse,
  CargoReportResponse,
  CargoScheduledReportListResponse,
  CreateReportRequest,
  CreateReportResponse,
  ListScheduledReportsQueryParams,
  ReportScheduleOnceRequest,
  ReportScheduleRequest,
} from './types';

export class AlCargoClientInstance {

  protected serviceName = 'cargo';

  constructor(public client: AlApiClient = AlDefaultClient) {
  }

  /**
   * Create report for given account_id
   */
  async createReport(accountId: string, reportRequest: CreateReportRequest): Promise<CreateReportResponse> {
    return this.client.post<CreateReportResponse>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      account_id: accountId,
      path: '/report',
      data: reportRequest,
    });
  }
  /**
   * Get report for given account_id and report_id
   */
  async getReport(accountId: string, reportId: string): Promise<CargoReportResponse> {
    return this.client.get<CargoReportResponse>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      account_id: accountId,
      path: `/report/${reportId}`,
    });
  }
  /**
   * Update one or several properties of existing report for given account_id and report_id
   */
  async updateReport(accountId: string, reportId: string, reportRequest: CreateReportRequest): Promise<any> {
    return this.client.post<any>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      account_id: accountId,
      path: `/report/${reportId}`,
      data: reportRequest,
    });
  }
  /**
   * Remove report for given account_id and report_id
   */
  async removeReport(accountId: string, reportId: string): Promise<any> {
    return this.client.delete<any>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      account_id: accountId,
      path: `/report/${reportId}`,
    });
  }
  /**
   * Get list of reports for given account_id
   */
  async listReports(accountId: string, queryParams: { report_type?: string } = {}): Promise<CargoReportListResponse> {
    return this.client.get<CargoReportListResponse>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      account_id: accountId,
      path: '/report',
      params: queryParams,
    });

  }
  /**
   * Scheduled report for given account_id
   */
  async scheduleReport(accountId: string, scheduleReportRequest: ReportScheduleRequest | ReportScheduleOnceRequest): Promise<any> {
    return this.client.post<any>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      account_id: accountId,
      path: '/scheduled_report',
      data: scheduleReportRequest,
    });
  }
  /**
   * Cancel scheduled report for given account_id and scheduled_report_id
   */
  async cancelScheduledReport(accountId: string, scheduleReportId: string):  Promise<any> {
    return this.client.post<any>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      account_id: accountId,
      path: `/scheduled_report/${scheduleReportId}/cancel`,
    });
  }
  /**
   * Remove scheduled report for given account_id and scheduled_report_id
   */
  async removeScheduledReport(accountId: string, scheduleReportId: string):  Promise<any> {
    return this.client.delete<any>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      account_id: accountId,
      path: `/scheduled_report/${scheduleReportId}`,
    });
  }
  /**
   * Get scheduled report for given account_id and scheduled_report_id
   */
  async getScheduledReport(accountId: string, scheduleReportId: string):  Promise<CargoReport> {
    return this.client.get<CargoReport>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      account_id: accountId,
      path: `/scheduled_report/${scheduleReportId}`,
    });

  }
  /**
   * Retrieve result data of scheduled report run for given account_id, scheduled_report_id and result_id
   */
  async getScheduledReportResult(accountId: string, scheduleReportId: string, resultId: string):  Promise<any> {
    return this.client.get<any>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      account_id: accountId,
      path: `/scheduled_report/${scheduleReportId}/result/${resultId}`,
    });
  }
  /**
   * Return compressed archive containing completed sub-results of scheduled report run for given account_id and scheduled_report_id
   * Archive will be formatted and compressed as tar.gz
   */
  async getScheduledReportResultArchive(accountId: string, scheduleReportId: string):  Promise<any> {
    return this.client.get<any>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      account_id: accountId,
      path: `/scheduled_report/${scheduleReportId}/result`,
    });
  }
  /**
   * List scheduled reports for given account_id.
   * This method is paginated
   */
  async listScheduledReports(accountId: string, queryParams?: ListScheduledReportsQueryParams): Promise<CargoScheduledReportListResponse> {
    const requestArgs: APIRequestParams = {
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      account_id: accountId,
      path: '/scheduled_report',
    };
    if (queryParams) {
      requestArgs.params = queryParams;
    }
    const result = await this.client.get(requestArgs);
    return result as CargoScheduledReportListResponse;
  }
}
