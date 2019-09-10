/**
 * Module to deal with available Cargo Public API endpoints
 */
import { ALClient, APIRequestParams } from '@al/client';
import date from 'date-and-time';

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
  report: CargoReportFormatted;
}

export interface CargoReportListResponse {
  account_id: string;
  reports: CargoReportFormatted[];
}

export interface CargoReport {
  id: string;
  name?: string;
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
  scheduled_report: CargoReportFormatted;
}

export interface CargoScheduledReportListResponse {
  account_id: string;
  continuation: string;
  scheduled_reports: CargoScheduledReport[];
}
class CargoReportFormatted implements CargoReport {
  public static import = (cargoReports: CargoReport[]): Array<CargoReportFormatted> => {
    let result: CargoReportFormatted[] = [];
    cargoReports.forEach(element => {
      let entity: CargoReportFormatted = new CargoReportFormatted();
      // Set the name properly.
      let name = element.hasOwnProperty('schedule_display_name') ? element.schedule_display_name : '';
      if (name !== null) {
          if (name.includes('Weekly')) {
              name = 'Weekly';
          } else if (name.includes('Daily')) {
              name = `${name} to ${name.split(',')[1]}`;
          } else if (name.includes('Hourly')) {
              name = 'Hourly';
          }
      }
      entity.schedule_display_name = name;
      result.push(entity);
    });
    return result;
  }
}

/* It is used for adding suffix to the formated_create_time in CargoScheduledReport */
const ordinals: string[] = ['th','st','nd','rd'];

class CargoScheduledReport implements CargoReport {
  formated_create_time: string;
  frequency_type: string;

  public static import = (cargoReport: CargoReport): CargoScheduledReport => {
    let entity   = new CargoScheduledReport();
    let datePipe = new Date();
    // Helper - date formatter.
    const formatTime = (timeStamp:number): string  => {
      const today         = new Date();
      const date          = date.format(timeStamp, 'MMMM DD, YYYY');
      const day           = date.format(timeStamp, 'DD');
      const monthYear     = date.format(timeStamp, 'MMM, YYYY');
      const nDay          = parseInt(day,10) % 100;
      const suffix        = (ordinals[(nDay-20)%10] || ordinals[nDay] || ordinals[0]);
      const formattedDate = `${day}${suffix} ${monthYear}`;
      return date.format(today, 'MMM DD, YYYY') === date ? 'Today': formattedDate;
    };
    const creationTime          = parseInt(cargoReport.create_time, 10) * 1000;
    entity.formated_create_time = formatTime(creationTime);
    entity.frequency_type       = cargoReport.schedule_display_name;
    return entity;
  }
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
    let report = await this.alClient.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/report/${reportId}`,
    });
    const cargoReports: Array<CargoReport> = [];
    cargoReports.push(report.report);
    const reportFormatted = CargoReportFormatted.import(cargoReports)[0];
    report.report = reportFormatted;
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
    let reports = await this.alClient.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: '/report',
      params: queryParams,
    });
    const reportsFormatted = CargoReportFormatted.import(reports.reports);
    reports.reports = reportsFormatted;
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
    const cargoReports: Array<CargoReport> = [];
    cargoReports.push(report);
    const formattedReport = CargoReportFormatted.import(cargoReports)[0];
    return formattedReport as CargoReportFormatted;
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
    const scheduledReports: CargoScheduledReport[] = [];
    // Set up the Scheduled Reports.
    result.scheduled_reports.forEach( (scheduled_report:CargoReport) => {
      scheduledReports.push(CargoScheduledReport.import(scheduled_report));
    });
    result.scheduled_reports = scheduledReports;
    return result as CargoScheduledReportListResponse;
  }
}

export const cargoClient =  new CargoClient();
