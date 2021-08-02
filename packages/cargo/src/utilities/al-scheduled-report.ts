import {
  ScheduledReportV2,
  TableauReportDefinitionV2,
} from '../types';

/**
 * AlTableauScheduledReport
 * builds a 'tableau' ReportScheduledV2 payload iteratively
 */
export class AlTableauScheduledReport {

  private reportDefinition: TableauReportDefinitionV2 = {};
  private schedule: ScheduledReportV2 = {
    name: "",
    type: "tableau",
    definition: this.reportDefinition
  };

  public setViewDefinition(siteId: string, worbookId: string, viewId: string): void {
    this.reportDefinition.site_id = siteId;
    this.reportDefinition.workbook_id = worbookId;
    this.reportDefinition.view_id = viewId;
  }

  public setFilterValues(filterValues: { [key: string]: string[] }): void {
    this.reportDefinition.filter_values = filterValues;
  }

  public setFormat(format: "csv" | "pdf"): void {
    this.reportDefinition.format = format;
  }

  public getScheduledReport() : ScheduledReportV2 {
    return this.schedule;
  }

  public getReportDefinition() : TableauReportDefinitionV2 {
    return this.reportDefinition;
  }

}
