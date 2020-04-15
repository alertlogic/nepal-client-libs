/**
 * Module to deal with available Assets Query Public API endpoints
 */
import { ALClient } from '@al/client';
import {
  HealthResponse,
  HealthSummaryResponse,
  FindAssetsRequest,
  TagsSummaryResponse,
  TopologyResponse,
  ExposuresDeploymentSummary,
  ExposuresSummary,
  ExposureQueryParams,
  ExposuresQueryResponse,
} from './types';

class AssetsQueryClient {

  private alClient = ALClient;

  /**
   * Get Collection Health
   * GET
   * /remediations/v1/:account_id/health/:asset_type
   * "https://api.cloudinsight.alertlogic.com/remediations/v1/10000001/health/agent"
   * asset_type: agent, appliance, network, vpc
   */
  async getHealth(accountId: string, assetType: string, queryParams?: {scope?: boolean, filter: string}) {
    const health = await this.alClient.get({
      account_id: accountId,
      service_name: 'remediations',
      path: `/health/${assetType}`,
      params: queryParams,
    });
    return health as HealthResponse;
  }

  /**
   * Get Collection Health Summary
   * GET
   * /remediations/v1/:account_id/health/summary
   * "https://api.cloudinsight.alertlogic.com/remediations/v1/10000001/health/summary"
   */
  async getHealthSummary(accountId: string,  queryParams?: {scope?: boolean, filter: string}) {
    const health = await this.alClient.get({
      account_id: accountId,
      service_name: 'remediations',
      path: '/health/summary',
      params: queryParams,
    });
    return health as HealthSummaryResponse;
  }

  /**
   * Find Asset
   * GET
   * /assets_query/v1/:account_id/find
   * "https://api.cloudinsight.alertlogic.com/assets_query/v1/01000001/find?collector_type=agent&uuid=CD7C26C3-FAA1-4AD1-86CB-9628ED1B3327"
   */
  async findAsset(accountId: string,  queryParams?: {uuid: string, collector_type?: string}) {
    const assets = await this.alClient.get({
      account_id: accountId,
      service_name: 'assets_query',
      path: '/find',
      params: queryParams,
    });
    return assets;
  }

  /**
   * Find Asset
   * GET
   * /assets_query/v1/:account_id/find
   * "https://api.cloudinsight.alertlogic.com/assets_query/v1/01000001/find?collector_type=agent&uuid=CD7C26C3-FAA1-4AD1-86CB-9628ED1B3327"
   */
  async findAssets(accountId: string,  queryParams?: FindAssetsRequest) {
    const assets = await this.alClient.get({
      account_id: accountId,
      service_name: 'assets_query',
      path: '/find',
      params: queryParams,
    });
    return assets;
  }

  /**
   * Get Asset Details
   * GET
   * /assets_query/v1/:account_id/details
   * "https://api.cloudinsight.alertlogic.com/assets_query/v1/12345678/details?type=host&key=id:i-0fa67ce21528409bc&deployment=aws:1234567890®ion=id:us-east-2"
   */
  async getAssetDetails(accountId: string,  queryParams?: {type?: string, key?: string, deployment?: string, region?: string, appliance_uuid?: string, ip_address?: string, port?: string, host_uuid?: string}) {
    const assets = await this.alClient.get({
      account_id: accountId,
      service_name: 'assets_query',
      path: '/details',
      params: queryParams,
    });
    return assets;
  }

  /**
   * Get Assets for Account
   * GET
   * /assets_query/v1/:account_id/assets
   * "https://api.cloudinsight.alertlogic.com/assets_query/v1/01000001/assets"
   */
  async getAccountAssets(accountId: string, queryParams?: any) {
    const assets = await this.alClient.get({
      account_id: accountId,
      service_name: 'assets_query',
      path: '/assets',
      params: queryParams,
    });
    return assets;
  }

  /**
   * Get Assets in Deployment
   * GET
   * /assets_query/v1/:account_id/deployments/:deployment_id/assets
   * "https://api.cloudinsight.alertlogic.com/assets_query/v1/01000001/deployments/1C0EFEC8-7DBE-480D-A025-ECC13DE30AD5/assets"
   */
  async getDeploymentAssets(accountId: string, deploymentId: string, queryParams?: any) {
    const assets = await this.alClient.get({
      account_id: accountId,
      service_name: 'assets_query',
      path: `/deployments/${deploymentId}/assets`,
      params: queryParams,
    });
    return assets;
  }

  /**
   * Get Tags Summary
   * GET
   * /assets_query/v1/:account_id/deployments/:deployment_id/tags/summary
   * "https://api.cloudinsight.alertlogic.com/assets_query/v1/01000001/deployments/CD7C26C3-FAA1-4AD1-86CB-9628ED1B3327/tags/summary"
   */
  async getTagsSummary(accountId: string, deploymentId: string) {
    const tags = await this.alClient.get({
      account_id: accountId,
      service_name: 'assets_query',
      path: `/deployments/${deploymentId}/tags/summary`,
    });
    return tags as TagsSummaryResponse;
  }

  /**
   * Topology Query
   * GET
   * /assets_query/v1/:account_id/deployments/:deployment_id/topology
   * "https://api.cloudinsight.alertlogic.com/assets_query/v1/19000001/deployments/814C2911-09BB-1005-9916-7831C1BAC182/topology"
   */
  async getTopology(accountId: string, deploymentId: string, queryParams?: {include_filters?: boolean, include_remediations?: boolean, disposed?: string, extras?: string}) {
    const topology = await this.alClient.get({
      account_id: accountId,
      service_name: 'assets_query',
      path: `/deployments/${deploymentId}/topology`,
      params: queryParams,
    });
    return topology as TopologyResponse;
  }

  /**
   * Get Assessment Specs
   * GET
   * /remediations/v1/:account_id/deployments/:deployment_id/assessment-specs
   * "https://api.cloudinsight.alertlogic.com/remediations/v1/10000001/deployments/347203EF-134C-1005-8499-1289DB15AB31/assessment-specs"
   */
  async getAssessmentSpecs(accountId: string, deploymentId: string) {
    const assessment = await this.alClient.get({
      account_id: accountId,
      service_name: 'remediations',
      path: `/deployments/${deploymentId}/assessment-specs`,
    });
    return assessment;
  }

  /**
   * Remediation Items List
   * GET
   * /remediations/v1/:account_id/deployments/:deployment_id/remediation-items-list
   * "https://api.cloudinsight.alertlogic.com/remediations/v1/10000001/deployments/347203EF-134C-1005-8499-1289DB15AB31/remediation-items-list"
   */
  async getRemediationItemsList(accountId: string, deploymentId: string) {
    const remediations = await this.alClient.get({
      account_id: accountId,
      service_name: 'remediations',
      path: `/deployments/${deploymentId}/remediation-items-list`,
    });
    return remediations;
  }

  /**
   * Remediation Items Query
   * GET
   * /remediations/v1/:account_id/deployments/:deployment_id/remediation-items
   * "https://api.cloudinsight.alertlogic.com/remediations/v1/10000001/deployments/347203EF-134C-1005-8499-1289DB15AB31/remediation-items"
   */
  async getRemediationItems(accountId: string, deploymentId: string) {
    const remediations = await this.alClient.get({
      account_id: accountId,
      service_name: 'remediations',
      path: `/deployments/${deploymentId}/remediation-items`,
    });
    return remediations;
  }

  /**
   * Complete Remediations
   * PUT
   * /remediations/v1/:account_id/deployments/:deployment_id/remediations
   * "https://api.cloudinsight.alertlogic.com/remediations/v1/10000001/deployments/347203EF-134C-1005-8499-1289DB15AB31/remediations"
   * -d '{"operation": "complete_remediations", "remediation_items": ["/al/15000001:814C2911-09BB-1005-9916-7831C1BAC182/remediation-item/0536575B914C32C8A5D28415D02E4545"]}
   */
  async completeRemediations(accountId: string, deploymentId: string, remediationData: {operation: string, remediation_items: string[]}) {
    const remediations = await this.alClient.set({
      account_id: accountId,
      service_name: 'remediations',
      path: `/deployments/${deploymentId}/remediations`,
      data: remediationData,
    });
    return remediations;
  }

  /**
   * Dispose Remediations
   * PUT
   * /remediations/v1/:account_id/deployments/:deployment_id/remediations
   * "https://api.cloudinsight.alertlogic.com/remediations/v1/10000001/deployments/347203EF-134C-1005-8499-1289DB15AB31/remediations"
   * -d '{"operation": "dispose_remediations", "reason": "Acceptable Risk", "comment": "This risk is acceptable", "expires": 0, "remediation_items": ["/al/15000001:814C2911-09BB-1005-9916-7831C1BAC182/remediation-item/0536575B914C32C8A5D28415D02E4545"]}
   */
  async disposeRemediations(accountId: string, deploymentId: string, remediationData: {operation: string, reason: string, comment: string, expires: number, remediation_items: string[]}) {
    const remediations = await this.alClient.set({
      account_id: accountId,
      service_name: 'remediations',
      path: `/deployments/${deploymentId}/remediations`,
      data: remediationData,
    });
    return remediations;
  }

  /**
   * Uncomplete Remediations
   * PUT
   * /remediations/v1/:account_id/deployments/:deployment_id/remediations
   * "https://api.cloudinsight.alertlogic.com/remediations/v1/10000001/deployments/347203EF-134C-1005-8499-1289DB15AB31/remediations"
   * -d '{"operation": "uncomplete_remediations", "remediation_itemss": ["/al/15000001:814C2911-09BB-1005-9916-7831C1BAC182/remediation-item/0536575B914C32C8A5D28415D02E4545"]}
   */
  async uncompleteRemediations(accountId: string, deploymentId: string, remediationData: {operation: string, remediation_items: string[]}) {
    const remediations = await this.alClient.set({
      account_id: accountId,
      service_name: 'remediations',
      path: `/deployments/${deploymentId}/remediations`,
      data: remediationData,
    });
    return remediations;
  }

  /**
   * Undispose Remediations
   * PUT
   * /remediations/v1/:account_id/deployments/:deployment_id/remediations
   * "https://api.cloudinsight.alertlogic.com/remediations/v1/10000001/deployments/347203EF-134C-1005-8499-1289DB15AB31/remediations"
   * -d '{"operation": "undispose_remediations", "remediation_itemss": ["/al/15000001:814C2911-09BB-1005-9916-7831C1BAC182/remediation-item/0536575B914C32C8A5D28415D02E4545"]}
   */
  async undisposeRemediations(accountId: string, deploymentId: string, remediationData: {operation: string, remediation_items: string[]}) {
    const remediations = await this.alClient.set({
      account_id: accountId,
      service_name: 'remediations',
      path: `/deployments/${deploymentId}/remediations`,
      data: remediationData,
    });
    return remediations;
  }

  /**
   * Plan Remediations
   * PUT
   * /remediations/v1/:account_id/deployments/:deployment_id/remediations
   * "https://api.cloudinsight.alertlogic.com/remediations/v1/10000001/deployments/347203EF-134C-1005-8499-1289DB15AB31/remediations"
   * -d '{"operation": "plan_remediations", "filters": ["stuff"], "user_id": "0987", "remediations": ["/al/15000001:814C2911-09BB-1005-9916-7831C1BAC182/remediation-item/0536575B914C32C8A5D28415D02E4545"]}
   */
  async planRemediations(accountId: string, deploymentId: string, remediationData: {operation: string, filters: string[], user_id: string, remediations: string[]}) {
    const remediations = await this.alClient.set({
      account_id: accountId,
      service_name: 'remediations',
      path: `/deployments/${deploymentId}/remediations`,
      data: remediationData,
    });
    return remediations;
  }

  /**
   * Exposures Deployment Summary
   * GET
   * /assets_query/v1/:account_id/exposures/deployment/summary
   * "https://api.cloudinsight.alertlogic.com/assets_query/v2/10000001/exposures/deployment/summary"
   */
  async getExposuresDeploymentSummary(accountId: string, queryParams?: ExposureQueryParams) {
    const summaries = await this.alClient.get({
      account_id: accountId,
      service_name: 'assets_query',
      path: 'exposures/deployment/summary',
      version: 'v2',
      params: queryParams,
    });
    return summaries as ExposuresSummary;
  }

  /**
   * Exposures Query
   * GET
   * /assets_query/v2/:account_id/exposures
   * "https://api.cloudinsight.alertlogic.com/assets_query/v2/10000001/exposures"
   */
  async queryExposures(accountId: string, queryParams?: ExposureQueryParams) {
    const summaries = await this.alClient.get({
      account_id: accountId,
      service_name: 'assets_query',
      path: 'exposures',
      version: 'v2',
      params: queryParams,
    });
    return summaries as ExposuresQueryResponse;
  }
}

export const assetsQueryClient = new AssetsQueryClient();
