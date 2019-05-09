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

export interface DashboardsRequestQueryParams {
  limit?: number;
  offset?: number;
  group?: string;
  search?: string;
  sort?: string;
  order?: string;
  fields?: string;
}

class DashboardsClient {

  private alClient = ALClient;
  private serviceName = 'dashboards';

  /**
   * Creates a dashboard item for given deployment and returns it
   */
  async createDeploymentDashboardItem(accountId: string, deploymentId: string, reportRequest: DashboardRequest) {
    const dashboard = await this.alClient.post({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/deployments/${deploymentId}/dashboard_items`,
      data: reportRequest,
    });
    return dashboard as DashboardItem;
  }
  /**
   * Return a dashboard item for a given deployment.
   */
  async getDeploymentDashboardItem(accountId: string, deploymentId: string, dashboardItemId: string) {
    const dashboard = await this.alClient.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/deployments/${deploymentId}/dashboard_items/${dashboardItemId}`,
    });
    return dashboard as DashboardItem;
  }
  /**
   * Update an existing dashboard item for a deployment and returns it.
   */
  async updateDeploymentDashboardItem(accountId: string, deploymentId: string, dashboardItemId: string, reportRequest: DashboardRequest) {
    const dashboard = await this.alClient.set({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/deployments/${deploymentId}/dashboard_items/${dashboardItemId}`,
      data: reportRequest,
    });
    return dashboard;
  }
  /**
   * Delete a dashboard item for a given deployment. Returns 204 No Content on success.
   */
  async deleteDeploymentDashboardItem(accountId: string, deploymentId: string, dashboardItemId: string) {
    const dashboard = await this.alClient.delete({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/deployments/${deploymentId}/dashboard_items/${dashboardItemId}`,
    });
    return dashboard;
  }
  /**
   * Return a list of dashboard items for a given deployment based on the criteria in the query parameters.
   */
  async listDeploymentDashboardItems(accountId: string, deploymentId: string, requestQueryParams: DashboardsRequestQueryParams = {}) {
    const dashboards = await this.alClient.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/deployments/${deploymentId}/dashboard_items`,
      params: requestQueryParams,
    });
    return dashboards as DashboardsListResponse;
  }
  /**
   * Creates a dashboard item for a given user and returns it
   */
  async createUserDashboardItem(accountId: string, userId: string, reportRequest: DashboardRequest) {
    const dashboard = await this.alClient.post({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/users/${userId}/dashboard_items`,
      data: reportRequest,
    });
    return dashboard as DashboardItem;
  }
  /**
   * Return a dashboard item for a given user.
   */
  async getUserDashboardItem(accountId: string, userId: string, dashboardItemId: string) {
    const dashboard = await this.alClient.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/users/${userId}/dashboard_items/${dashboardItemId}`,
    });
    return dashboard as DashboardItem;
  }
  /**
   * Update an existing dashboard item for a user and returns it.
   */
  async updateUserDashboardItem(accountId: string, userId: string, dashboardItemId: string, reportRequest: DashboardRequest) {
    const dashboard = await this.alClient.set({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/users/${userId}/dashboard_items/${dashboardItemId}`,
      data: reportRequest,
    });
    return dashboard;
  }
  /**
   * Delete a dashboard item for a given user. Returns 204 No Content on success.
   */
  async deleteUserDashboardItem(accountId: string, userId: string, dashboardItemId: string) {
    const dashboard = await this.alClient.delete({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/users/${userId}/dashboard_items/${dashboardItemId}`,
    });
    return dashboard;
  }
  /**
   * Return a list of dashboard items for a given user based on the criteria in the query parameters.
   */
  async listUserDashboardItems(accountId: string, userId: string, requestQueryParams: DashboardsRequestQueryParams = {}) {
    const dashboards = await this.alClient.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/users/${userId}/dashboard_items`,
      params: requestQueryParams,
    });
    return dashboards as DashboardsListResponse;
  }
  /**
   * Creates a user dashboard item for the authenticated user and returns it
   */
  async createOwnDashboardItem(accountId: string, reportRequest: DashboardRequest) {
    const dashboard = await this.alClient.post({
      service_name: this.serviceName,
      account_id: accountId,
      path: '/user/dashboard_items',
      data: reportRequest,
    });
    return dashboard as DashboardItem;
  }
  /**
   * Get a dashboard item for the authenticated user.
   */
  async getOwnDashboardItem(accountId: string, dashboardItemId: string) {
    const dashboard = await this.alClient.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/user/dashboard_items/${dashboardItemId}`,
    });
    return dashboard as DashboardItem;
  }
  /**
   * Return a list of dashboard items for the authenticated user based on the criteria in the query parameters.
   */
  async listOwnDashboardItems(accountId: string, requestQueryParams: DashboardsRequestQueryParams = {}) {
    const dashboards = await this.alClient.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: '/user/dashboard_items',
      params: requestQueryParams,
    });
    return dashboards as DashboardsListResponse;
  }
  /**
   * Update an existing user dashboard item (of the authenticated user) and return it.
   */
  async updateOwnDashboardItem(accountId: string, dashboardItemId: string, reportRequest: DashboardRequest) {
    const dashboard = await this.alClient.set({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/user/dashboard_items/${dashboardItemId}`,
      data: reportRequest,
    });
    return dashboard;
  }
  /**
   * Delete a dashboard item for the authenticated user.
   */
  async deleteOwnDashboardItem(accountId: string, dashboardItemId: string) {
    const dashboard = await this.alClient.delete({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/user/dashboard_items/${dashboardItemId}`,
    });
    return dashboard;
  }
}

export const dashboardsClient =  new DashboardsClient();
