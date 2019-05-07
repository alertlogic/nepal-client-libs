/**
 * Module to deal with available Tacoma Public API endpoints
 */
import { ALClient } from '@al/client';

export interface SavedView {
  account_id?: string;
  site_id?: string;
  saved_view?: SavedViewsListResponse;
}

export interface WorkbookView {
  account_id?: string;
  site_id?: string;
  workbook_id?: string;
  view?: {
    id?: string;
    name?: string;
    description?: string;
    content_url?: string;
    embed_url?: string;
    saved_views?: SavedViewsListResponse[];
  };
}

export interface SavedViewsListResponse {
  id?: string;
  name?: string;
  embed_url?: string;
}

export interface ViewsListResponse {
  id?: string;
  name?: string;
  description?: string;
  content_url?: string;
  embed_url?: string;
  saved_views?: SavedViewsListResponse[];
}

export interface WorkbooksResponse {
  id?: string;
  name?: string;
  description?: string;
  content_url?: string;
  project?: {
    id?: string;
    name?: string;
  };
  owner?: {
    id?: string;
  };
  subscriptions?: string[];
  tags?: string[];
  icon_name?: string;
  sub_menu?: string;
  views?: ViewsListResponse[];
}

export interface WorkbookSitesResponse {
  id?: string;
  name?: string;
  content_url: string;
  workbooks?: WorkbooksResponse[];
}

export interface WorkbooksListResponse {
  account_id?: string;
  sites?: WorkbookSitesResponse[];
}

class TacomaClient {

  private alClient = ALClient;
  private serviceName = 'tacoma';

  /**
   * Export saved view csv/pdf report
   * GET
   * /tacoma/v1/:account_id/sites/:site_id/saved_views/:saved_view_id/export
   * "https://api.cloudinsight.alertlogic.com/tacoma/v1/2/sites/9d59802f-7b4a-4d0c-87c5-2ed303fc300b/saved_views/a90b2529-ea3f-4e8b-917b-3793ac905c34/export?format=pdf"
   */
  async exportSavedViewReport(accountId: string, siteId: string, savedViewId: string, fileFormat?: string) {
    const report = await this.alClient.fetch({
      account_id: accountId,
      service_name: this.serviceName,
      path: `/sites/${siteId}/saved_views/${savedViewId}/export`,
      params: { format: fileFormat },
    });
    return report;
  }

  /**
   * Get saved view
   * GET
   * /tacoma/v1/:account_id/sites/:site_id/saved_views/:saved_view_id
   * "https://api.cloudinsight.alertlogic.com/tacoma/v1/2/sites/9d59802f-7b4a-4d0c-87c5-2ed303fc300b/saved_views/a90b2529-ea3f-4e8b-917b-3793ac905c34"
   */
  async getSavedView(accountId: string, siteId: string, savedViewId: string) {
    const view = await this.alClient.fetch({
      account_id: accountId,
      service_name: this.serviceName,
      path: `/sites/${siteId}/saved_views/${savedViewId}`,
    });
    return view as SavedView;
  }

  /**
   * Export view csv/pdf report
   * GET
   * /tacoma/v1/:account_id/sites/:site_id/workbooks/:workbook_id/views/:view_id/export
   * "https:/api.cloudinsight.alertlogic.com/tacoma/v1/2/sites/9d59802f-7b4a-4d0c-87c5-2ed303fc300b/workbooks/9d59802f-7b4a-4d0c-97c5-1ed303fc300a/views/a90b2529-ea3f-4e8b-917b-3793ac905c34/export?format=csv"
   */
  async exportViewReport(accountId: string, siteId: string, workBookId: string, viewId: string) {
    const report = await this.alClient.fetch({
      account_id: accountId,
      service_name: this.serviceName,
      path: `/sites/${siteId}/workbooks/${workBookId}/views/${viewId}/export`,
    });
    return report;
  }

  /**
   * Get view
   * GET
   * /tacoma/v1/:account_id/sites/:site_id/workbooks/:workbook_id/views/:view_id
   * "https://api.cloudinsight.alertlogic.com/tacoma/v1/2/sites/9d59802f-7b4a-4d0c-87c5-2ed303fc300b/workbooks/9d59802f-7b4a-4d0c-97c5-1ed303fc300a/views/a90b2529-ea3f-4e8b-917b-3793ac905c34"
   */
  async getView(accountId: string, siteId: string, workBookId: string, viewId: string) {
    const view = await this.alClient.fetch({
      account_id: accountId,
      service_name: this.serviceName,
      path: `/sites/${siteId}/workbooks/${workBookId}/views/${viewId}`,
    });
    return view as WorkbookView;
  }

  /**
   * Export workbook pdf report
   * GET
   * /tacoma/v1/:account_id/sites/:site_id/workbooks/:workbook_id/export
   * "https:/api.cloudinsight.alertlogic.com/tacoma/v1/2/sites/9d59802f-7b4a-4d0c-87c5-2ed303fc300b/workbooks/9d59802f-7b4a-4d0c-97c5-1ed303fc300a/export?format=pdf&cid=2"
   */
  async exportWorkbookReport(accountId: string, siteId: string, workBookId: string, format?: string, anyQueryParameter?: string) {
    const report = await this.alClient.fetch({
      account_id: accountId,
      service_name: this.serviceName,
      path: `/sites/${siteId}/workbooks/${workBookId}/export?${anyQueryParameter}`,
    });
    return report;
  }

  /**
   * Get workbook preview
   * GET
   * /tacoma/v1/:account_id/sites/:site_id/workbooks/:workbook_id/preview
   * "https://api.cloudinsight.alertlogic.com/tacoma/v1/2/sites/9d59802f-7b4a-4d0c-87c5-2ed303fc300b/workbooks/9d59802f-7b4a-4d0c-97c5-1ed303fc300a/preview"
   */
  async getWorkbookPreview(accountId: string, siteId: string, workBookId: string) {
    const workbook = await this.alClient.fetch({
      account_id: accountId,
      service_name: this.serviceName,
      path: `/sites/${siteId}/workbooks/${workBookId}/preview`,
    });
    return workbook;
  }

  /**
   * Get workbooks
   * GET
   * /tacoma/v1/:account_id/workbooks
   * "https://api.cloudinsight.alertlogic.com/tacoma/v1/2/workbooks?filter_subscriptions=false&sub_menu=Risk"
   */
  async getWorkbook(accountId: string, queryParams?:{filter_subscriptions?: string, sub_menu?: string}) {
    const workbooks = await this.alClient.fetch({
      account_id: accountId,
      service_name: this.serviceName,
      path: '/workbooks',
      params: queryParams,
    });
    return workbooks as WorkbooksListResponse;
  }

}

export const tacomaClient = new TacomaClient();
