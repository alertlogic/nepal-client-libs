/**
 * Module to deal with available Dashboards Public API endpoints
 */
import { ALClient } from '@al/client';

export interface DashboardRequest {
  name: string;
  type: string;
  [key:string]: any;
}

export interface DashboardItem {
  id: string;
  account_id: string;
  deployment_id: string;
  environment_id: string;
  [key:string]: any;
  name: string;
  type: string;
  created: UserTimeStamp;
  modified: UserTimeStamp;
}

export interface UserTimeStamp {
  by: string;
  at: number;
}

export interface DashboardsListResponse {
  dashboard_items: DashboardItem[];
  meta_data: {
    total_count: number;
    offset: number;
    limit: number;
    links: {
      last: string;
      next: string;
    }
  };
}

class DashboardsClient {

  private alClient = ALClient;
  private serviceName = 'dashboards';

  /**
   * Creates a dashboard item and returns it
   */
  async createDashboardItem(accountId: string, deploymentId: string, reportRequest: DashboardRequest) {
    const dashboard = await this.alClient.post({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/deployments/${deploymentId}/dashboard_items`,
      data: reportRequest,
    });
    return dashboard as DashboardItem;
  }
  /**
   * Return a dashboard item.
   */
  async getDashboardItem(accountId: string, deploymentId: string, dashboardItemId: string) {
    const dashboard = await this.alClient.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/deployments/${deploymentId}/dashboard_items/${dashboardItemId}`,
    });
    return dashboard as DashboardItem;
  }
  /**
   * Update an existing dashboard item and return it.
   */
  async updateDashboardItem(accountId: string, deploymentId: string, dashboardItemId: string, reportRequest: DashboardRequest) {
    const dashboard = await this.alClient.set({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/deployments/${deploymentId}/dashboard_items/${dashboardItemId}`,
      data: reportRequest,
    });
    return dashboard;
  }
  /**
   * Delete a dashboard item. Returns 204 No Content on success.
   */
  async deleteDashboardItem(accountId: string, deploymentId: string, dashboardItemId: string) {
    const dashboard = await this.alClient.delete({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/deployments/${deploymentId}/dashboard_items/${dashboardItemId}`,
    });
    return dashboard;
  }
  /**
   * Return a list of dashboard items based on the criteria in the query parameters.
   */
  async listDashboardItems(accountId: string, deploymentId: string) {
    const dashboards = await this.alClient.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/deployments/${deploymentId}/dashboard_items`,
    });
    return dashboards as DashboardsListResponse;
  }
}

export const dashboardsClient =  new DashboardsClient();
