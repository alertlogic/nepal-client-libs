/**
 * Module to deal with available Dashboards Public API endpoints
 */
import { ALClient } from '@al/client';
import {
  DashboardRequest,
  DeploymentDashboardItem,
  DashboardItemsRequestQueryParams,
  DashboardItemsListResponse,
  UserDashboardItem,
  DashboardGroup,
  DashboardRequestParams,
  SharedDashboardItem,
  DashboardGroupsRequestParams,
  DashboardGroupsResponse,
  SharedDashboardItemsRequestQueryParams,
} from './types';

class DashboardsClient {

  private alClient = ALClient;
  private serviceName = 'dashboards';
  private version = 'v2';

  /**
   * Creates a dashboard item for given deployment and returns it
   */
  async createDeploymentDashboardItem(accountId: string, deploymentId: string, reportRequest: DashboardRequest) {
    const item = await this.alClient.post({
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/deployments/${deploymentId}/dashboard_items`,
      data: reportRequest,
    });
    return item as DeploymentDashboardItem;
  }
  /**
   * Return a dashboard item for a given deployment.
   */
  async getDeploymentDashboardItem(accountId: string, deploymentId: string, dashboardItemId: string) {
    const item = await this.alClient.get({
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/deployments/${deploymentId}/dashboard_items/${dashboardItemId}`,
    });
    return item as DeploymentDashboardItem;
  }
  /**
   * Update an existing dashboard item for a deployment and returns it.
   */
  async updateDeploymentDashboardItem(accountId: string, deploymentId: string, dashboardItemId: string, reportRequest: DashboardRequest) {
    const item = await this.alClient.set({
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/deployments/${deploymentId}/dashboard_items/${dashboardItemId}`,
      data: reportRequest,
    });
    return item;
  }
  /**
   * Delete a dashboard item for a given deployment. Returns 204 No Content on success.
   */
  async deleteDeploymentDashboardItem(accountId: string, deploymentId: string, dashboardItemId: string) {
    const item = await this.alClient.delete({
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/deployments/${deploymentId}/dashboard_items/${dashboardItemId}`,
    });
    return item;
  }
  /**
   * Return a list of dashboard items for a given deployment based on the criteria in the query parameters.
   */
  async listDeploymentDashboardItems(accountId: string, deploymentId: string, requestQueryParams: DashboardItemsRequestQueryParams = {}) {
    const items = await this.alClient.get({
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/deployments/${deploymentId}/dashboard_items`,
      params: requestQueryParams,
    });
    return items as DashboardItemsListResponse;
  }
  /**
   * Creates a dashboard item for a given user and returns it
   */
  async createUserDashboardItem(accountId: string, userId: string, reportRequest: DashboardRequest) {
    const item = await this.alClient.post({
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/users/${userId}/dashboard_items`,
      data: reportRequest,
    });
    return item as UserDashboardItem;
  }
  /**
   * Return a dashboard item for a given user.
   */
  async getUserDashboardItem(accountId: string, userId: string, dashboardItemId: string, requestQueryParams: {resolve_shared_refs?: boolean} = {}) {
    const item = await this.alClient.get({
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/users/${userId}/dashboard_items/${dashboardItemId}`,
      params: requestQueryParams,
    });
    return item as UserDashboardItem;
  }
  /**
   * Update an existing dashboard item for a user and returns it.
   */
  async updateUserDashboardItem(accountId: string, userId: string, dashboardItemId: string, reportRequest: DashboardRequest) {
    const dashboard = await this.alClient.set({
      service_name: this.serviceName,
      version: this.version,
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
    const item = await this.alClient.delete({
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/users/${userId}/dashboard_items/${dashboardItemId}`,
    });
    return item;
  }
  /**
   * Return a list of dashboard items for a given user based on the criteria in the query parameters.
   */
  async listUserDashboardItems(accountId: string, userId: string, requestQueryParams: DashboardItemsRequestQueryParams = {}) {
    const items = await this.alClient.get({
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/users/${userId}/dashboard_items`,
      params: requestQueryParams,
    });
    return items as DashboardItemsListResponse;
  }
  /**
   * Creates a user dashboard item for the authenticated user and returns it
   */
  async createOwnDashboardItem(accountId: string, reportRequest: DashboardRequest) {
    const dashboard = await this.alClient.post({
      service_name: this.serviceName,
      version: this.version,
      path: '/user/dashboard_items',
      data: reportRequest,
      context_account_id: accountId,
    });
    return dashboard as UserDashboardItem;
  }
  /**
   * Get a dashboard item for the authenticated user.
   */
  async getOwnDashboardItem(accountId: string, dashboardItemId: string, requestQueryParams: {resolve_shared_refs?: boolean} = {}) {
    const item = await this.alClient.get({
      service_name: this.serviceName,
      version: this.version,
      path: `/user/dashboard_items/${dashboardItemId}`,
      params: requestQueryParams,
      context_account_id: accountId,
    });
    return item as UserDashboardItem;
  }
  /**
   * Return a list of dashboard items for the authenticated user based on the criteria in the query parameters.
   */
  async listOwnDashboardItems(accountId: string, requestQueryParams: DashboardItemsRequestQueryParams = {}) {
    const items = await this.alClient.get({
      service_name: this.serviceName,
      version: this.version,
      path: '/user/dashboard_items',
      params: requestQueryParams,
      context_account_id: accountId,
    });
    return items as DashboardItemsListResponse;
  }
  /**
   * Update an existing user dashboard item (of the authenticated user) and return it.
   */
  async updateOwnDashboardItem(accountId: string, dashboardItemId: string, reportRequest: DashboardRequest) {
    const dashboard = await this.alClient.set({
      service_name: this.serviceName,
      version: this.version,
      path: `/user/dashboard_items/${dashboardItemId}`,
      data: reportRequest,
      context_account_id: accountId,
    });
    return dashboard as UserDashboardItem;
  }
  /**
   * Delete a dashboard item for the authenticated user.
   */
  async deleteOwnDashboardItem(accountId: string, dashboardItemId: string) {
    const dashboard = await this.alClient.delete({
      service_name: this.serviceName,
      version: this.version,
      path: `/user/dashboard_items/${dashboardItemId}`,
      context_account_id: accountId,
    });
    return dashboard;
  }
  /**
   * Creates a group to organize dashboard items within (currently, only shared dashboard items)
   * A group can be parented to another group of the same dashboard type to create nested groups, and dashboard items of that type can be associated to groups by setting their group_id property
   * Groups can only be managed by users with appropriate privileges.
   */
  async createDashboardGroup(accountId: string, dashboardGroup: DashboardGroup) {
    const group = await this.alClient.post({
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: '/groups/shared',
      data: dashboardGroup,
    });
    return group as DashboardGroup;
  }
  /**
   * Get a group by account ID and group ID.
   */
  async getDashboardGroup(accountId: string, dashboardGroupId: string, requestQueryParams: DashboardRequestParams = {}) {
    const group = await this.alClient.get({
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/groups/shared/${dashboardGroupId}`,
      params: requestQueryParams,
    });
    return group as DashboardGroup;
  }
  /**
   * Get a list of all groups (by dashboard type) for the given account ID.
   */
  async listDashboardGroups(accountId: string, requestQueryParams: DashboardGroupsRequestParams = {}) {
    const groups = await this.alClient.get({
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: '/groups/shared',
      params: requestQueryParams,
    });
    return groups as DashboardGroupsResponse;
  }
  /**
   * Update a group. Groups are associated with a specific dashboard type (currently only shared).
   */
  async updateDashboardGroup(accountId: string, dashboardGroupId: string, dashboardGroup: DashboardGroup) {
    const group = await this.alClient.set({
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/groups/shared/${dashboardGroupId}`,
      data: dashboardGroup,
    });
    return group as DashboardGroup;
  }
  /**
   * Permanently delete a group. If a group is deleted, all child groups and all associated dashboard items will be permanently deleted as well.
   */
  async deleteDashboardGroup(accountId: string, dashboardGroupId: string) {
    const group = await this.alClient.delete({
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/groups/shared/${dashboardGroupId}`,
    });
    return group;
  }
  /**
   * Creates a shared dashboard item and returns it.
   * Shared dashboard items can only be managed by users with appropriate privileges.
   */
  async createSharedDashboardItem(accountId: string, sharedDashboardItem: SharedDashboardItem) {
    const item = await this.alClient.post({
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: '/shared/dashboard_items',
      data: sharedDashboardItem,
    });
    return item as SharedDashboardItem;
  }
  /**
   * Get a shared dashboard item.
   */
  async getSharedDashboardItem(accountId: string, sharedDashboardItemId: string) {
    const item = await this.alClient.get({
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/shared/dashboard_items/${sharedDashboardItemId}`,
    });
    return item as SharedDashboardItem;
  }
  /**
   * Get a list of shared dashboard items based on the criteria in the query parameters.
   */
  async listSharedDashboardItems(accountId: string, requestQueryParams: SharedDashboardItemsRequestQueryParams = {}) {
    const items = await this.alClient.get({
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: '/shared/dashboard_items',
      params: requestQueryParams,
    });
    return items as DashboardItemsListResponse;
  }
  /**
   * Update an existing shared dashboard item and return it.
   * Note that the type of a shared dashboard item cannot be altered once it has been created. This will result in a validation error.
   */
  async updateSharedDashboardItem(accountId: string, sharedDashboardItemId: string, sharedDashboardItem: SharedDashboardItem) {
    const group = await this.alClient.set({
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/shared/dashboard_items/${sharedDashboardItemId}`,
      data: sharedDashboardItem,
    });
    return group as SharedDashboardItem;
  }
  /**
   * Delete a shared dashboard item.
   */
  async deleteSharedDashboardItem(accountId: string, sharedDashboardItemId: string) {
    const group = await this.alClient.delete({
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/shared/dashboard_items/${sharedDashboardItemId}`,
    });
    return group;
  }
}

export const dashboardsClient =  new DashboardsClient();
