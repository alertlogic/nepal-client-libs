/**
 * Module to deal with available Dashboards Public API endpoints
 */
import { AlDefaultClient,
  AlLocation } from '@al/core';
import {
  DashboardGroup,
  DashboardGroupsRequestParams,
  DashboardGroupsResponse,
  DashboardItemsListResponse,
  DashboardItemsRequestQueryParams,
  DashboardRequest,
  DashboardRequestParams,
  DeploymentDashboardItem,
  SharedDashboardItem,
  SharedDashboardItemsRequestQueryParams,
  UpdateDashboardItemResponse,
  UserDashboardItem,
} from './types';

class DashboardsClient {

  private client = AlDefaultClient;
  private serviceName = 'dashboards';
  private version = 'v2';

  /**
   * Creates a dashboard item for given deployment and returns it
   */
  async createDeploymentDashboardItem(accountId: string, deploymentId: string, reportRequest: DashboardRequest): Promise<DeploymentDashboardItem> {
    return this.client.post<DeploymentDashboardItem>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/deployments/${deploymentId}/dashboard_items`,
      data: reportRequest,
    });
   }
  /**
   * Return a dashboard item for a given deployment.
   */
  async getDeploymentDashboardItem(accountId: string, deploymentId: string, dashboardItemId: string): Promise<DeploymentDashboardItem> {
    return this.client.get<DeploymentDashboardItem>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/deployments/${deploymentId}/dashboard_items/${dashboardItemId}`,
    });
   }
  /**
   * Update an existing dashboard item for a deployment and returns it.
   */
  async updateDeploymentDashboardItem(accountId: string, deploymentId: string, dashboardItemId: string, reportRequest: DashboardRequest): Promise<UpdateDashboardItemResponse> {
    return this.client.put<UpdateDashboardItemResponse>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/deployments/${deploymentId}/dashboard_items/${dashboardItemId}`,
      data: reportRequest,
    });
  }
  /**
   * Delete a dashboard item for a given deployment. Returns 204 No Content on success.
   */
  async deleteDeploymentDashboardItem(accountId: string, deploymentId: string, dashboardItemId: string): Promise<void> {
    return this.client.delete({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/deployments/${deploymentId}/dashboard_items/${dashboardItemId}`,
    });
  }
  /**
   * Return a list of dashboard items for a given deployment based on the criteria in the query parameters.
   */
  async listDeploymentDashboardItems(accountId: string, deploymentId: string, requestQueryParams: DashboardItemsRequestQueryParams = {}): Promise<DashboardItemsListResponse> {
    return this.client.get<DashboardItemsListResponse>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/deployments/${deploymentId}/dashboard_items`,
      params: requestQueryParams,
    });
   }
  /**
   * Creates a dashboard item for a given user and returns it
   */
  async createUserDashboardItem(accountId: string, userId: string, reportRequest: DashboardRequest): Promise<UserDashboardItem> {
    return this.client.post<UserDashboardItem>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/users/${userId}/dashboard_items`,
      data: reportRequest,
    });
   }
  /**
   * Return a dashboard item for a given user.
   */
  async getUserDashboardItem(accountId: string, userId: string, dashboardItemId: string, requestQueryParams: {resolve_shared_refs?: boolean} = {}): Promise<UserDashboardItem> {
    return this.client.get<UserDashboardItem>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/users/${userId}/dashboard_items/${dashboardItemId}`,
      params: requestQueryParams,
    });
   }
  /**
   * Update an existing dashboard item for a user and returns it.
   */
  async updateUserDashboardItem(accountId: string, userId: string, dashboardItemId: string, reportRequest: DashboardRequest): Promise<unknown> {
    return this.client.put({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/users/${userId}/dashboard_items/${dashboardItemId}`,
      data: reportRequest,
    });
  }
  /**
   * Delete a dashboard item for a given user. Returns 204 No Content on success.
   */
  async deleteUserDashboardItem(accountId: string, userId: string, dashboardItemId: string): Promise<void> {
    return this.client.delete({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/users/${userId}/dashboard_items/${dashboardItemId}`,
    });
  }
  /**
   * Return a list of dashboard items for a given user based on the criteria in the query parameters.
   */
  async listUserDashboardItems(accountId: string, userId: string, requestQueryParams: DashboardItemsRequestQueryParams = {}): Promise<DashboardItemsListResponse> {
    return this.client.get<DashboardItemsListResponse>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/users/${userId}/dashboard_items`,
      params: requestQueryParams,
    });
   }
  /**
   * Creates a user dashboard item for the authenticated user and returns it
   */
  async createOwnDashboardItem(accountId: string, reportRequest: DashboardRequest): Promise<UserDashboardItem> {
    return this.client.post<UserDashboardItem>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      version: this.version,
      path: '/user/dashboard_items',
      data: reportRequest,
      context_account_id: accountId,
    });
   }
  /**
   * Get a dashboard item for the authenticated user.
   */
  async getOwnDashboardItem(accountId: string, dashboardItemId: string, requestQueryParams: {resolve_shared_refs?: boolean} = {}): Promise<UserDashboardItem> {
    return this.client.get<UserDashboardItem>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      version: this.version,
      path: `/user/dashboard_items/${dashboardItemId}`,
      params: requestQueryParams,
      context_account_id: accountId,
    });
   }
  /**
   * Return a list of dashboard items for the authenticated user based on the criteria in the query parameters.
   */
  async listOwnDashboardItems(accountId: string, requestQueryParams: DashboardItemsRequestQueryParams = {}): Promise<DashboardItemsListResponse> {
    return this.client.get<DashboardItemsListResponse>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      version: this.version,
      path: '/user/dashboard_items',
      params: requestQueryParams,
      context_account_id: accountId,
    });
   }
  /**
   * Update an existing user dashboard item (of the authenticated user) and return it.
   */
  async updateOwnDashboardItem(accountId: string, dashboardItemId: string, reportRequest: DashboardRequest): Promise<UserDashboardItem> {
    return this.client.put<UserDashboardItem>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      version: this.version,
      path: `/user/dashboard_items/${dashboardItemId}`,
      data: reportRequest,
      context_account_id: accountId,
    });
   }
  /**
   * Delete a dashboard item for the authenticated user.
   */
  async deleteOwnDashboardItem(accountId: string, dashboardItemId: string): Promise<void> {
    return this.client.delete({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      version: this.version,
      path: `/user/dashboard_items/${dashboardItemId}`,
      context_account_id: accountId,
    });
  }
  /**
   * Creates a group to organize dashboard items within (currently, only shared dashboard items)
   * A group can be parented to another group of the same dashboard type to create nested groups, and dashboard items of that type can be associated to groups by setting their group_id property
   * Groups can only be managed by users with appropriate privileges.
   */
  async createDashboardGroup(accountId: string, dashboardGroup: DashboardGroup): Promise<DashboardGroup> {
    return this.client.post<DashboardGroup>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: '/groups/shared',
      data: dashboardGroup,
    });
   }
  /**
   * Get a group by account ID and group ID.
   */
  async getDashboardGroup(accountId: string, dashboardGroupId: string, requestQueryParams: DashboardRequestParams = {}): Promise<DashboardGroup> {
    return this.client.get<DashboardGroup>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/groups/shared/${dashboardGroupId}`,
      params: requestQueryParams,
    });
   }
  /**
   * Get a list of all groups (by dashboard type) for the given account ID.
   */
  async listDashboardGroups(accountId: string, requestQueryParams: DashboardGroupsRequestParams = {}): Promise<DashboardGroupsResponse> {
    return this.client.get<DashboardGroupsResponse>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: '/groups/shared',
      params: requestQueryParams,
    });
   }
  /**
   * Update a group. Groups are associated with a specific dashboard type (currently only shared).
   */
  async updateDashboardGroup(accountId: string, dashboardGroupId: string, dashboardGroup: DashboardGroup): Promise<DashboardGroup> {
    return this.client.put<DashboardGroup>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/groups/shared/${dashboardGroupId}`,
      data: dashboardGroup,
    });
   }
  /**
   * Permanently delete a group. If a group is deleted, all child groups and all associated dashboard items will be permanently deleted as well.
   */
  async deleteDashboardGroup(accountId: string, dashboardGroupId: string): Promise<void> {
    return this.client.delete({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/groups/shared/${dashboardGroupId}`,
    });
  }
  /**
   * Creates a shared dashboard item and returns it.
   * Shared dashboard items can only be managed by users with appropriate privileges.
   */
  async createSharedDashboardItem(accountId: string, sharedDashboardItem: SharedDashboardItem): Promise<SharedDashboardItem> {
    return this.client.post<SharedDashboardItem>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: '/shared/dashboard_items',
      data: sharedDashboardItem,
    });
   }
  /**
   * Get a shared dashboard item.
   */
  async getSharedDashboardItem(accountId: string, sharedDashboardItemId: string): Promise<SharedDashboardItem> {
    return this.client.get<SharedDashboardItem>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/shared/dashboard_items/${sharedDashboardItemId}`,
    });
   }
  /**
   * Get a list of shared dashboard items based on the criteria in the query parameters.
   */
  async listSharedDashboardItems(accountId: string, requestQueryParams: SharedDashboardItemsRequestQueryParams = {}): Promise<DashboardItemsListResponse> {
    return this.client.get<DashboardItemsListResponse>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: '/shared/dashboard_items',
      params: requestQueryParams,
    });
   }
  /**
   * Update an existing shared dashboard item and return it.
   * Note that the type of a shared dashboard item cannot be altered once it has been created. This will result in a validation error.
   */
  async updateSharedDashboardItem(accountId: string, sharedDashboardItemId: string, sharedDashboardItem: SharedDashboardItem): Promise<SharedDashboardItem> {
    return this.client.put<SharedDashboardItem>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/shared/dashboard_items/${sharedDashboardItemId}`,
      data: sharedDashboardItem,
    });
   }
  /**
   * Delete a shared dashboard item.
   */
  async deleteSharedDashboardItem(accountId: string, sharedDashboardItemId: string): Promise<void> {
    return this.client.delete({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/shared/dashboard_items/${sharedDashboardItemId}`,
    });
  }
}

export const dashboardsClient =  new DashboardsClient();
