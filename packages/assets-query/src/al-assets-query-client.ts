/**
 * Module to deal with available Assets Query Public API endpoints
 */
import {
  AlApiClient,
  AlDefaultClient,
  AlLocation
} from '@al/core';
import {
  ExposureQueryParams,
  ExposuresQueryResponse,
  ExposuresSummary,
  ExposuresCountSummary,
  ExposuresCountSummaryQueryParams,
  ExposureSeverities,
  FindAssetsRequest,
  HealthResponse,
  HealthSummaryResponse,
  TagsSummaryResponse,
  TopologyResponse,
  CollectionHealthQueryParams,
  RemediationItemsQueryParams,
  RemediationItemsQueryResponse,
  AssetsQueryParams,
  AssetQueryGeneralResponse,
  FoundAsset,
  GenericResponse,
  RemediationsItemsListResponse,
  UndisposeRemediationsRequestBody,
  AssetsQueryIncidentIdsPayload,
  AssetsQueryIncidentIdsResponse,
} from './types';
import {
  AssetGroup,
  AssetGroupListResponse,
  AssetGroupPayload,
  AssetGroupTopologyQueryParams,
  AssetGroupTopologyResponse,
  Scope
} from './types/assets/asset-groups';
import {
  AssetTypesResponse,
  DeleteAssetGroupResponse,
} from './types/assets/asset-types';

import { PhoenixTopologySnapshot, TopologyNode } from './types/assets';

export class AlAssetsQueryClientInstance {


  /* istanbul ignore next */
  constructor(public client: AlApiClient = AlDefaultClient) {
  }


  /**
    *  Gets the topology tree for a given deployment and returns a
    *  PhoenixTopologySnapshot describing it.
    *  This endpoint only return assets downto the subnet level.
    * @remarks https://console.cloudinsight.alertlogic.com/api/assets_query/#api-Topology-GetConfigTopology
    */
  async getConfigTopologySnapshot(accountId: string, deploymentId: string): Promise<PhoenixTopologySnapshot> {
    const rawdata = await this.client.get({
      service_stack: AlLocation.InsightAPI,
      version: 'v1',
      account_id: accountId,
      service_name: 'assets_query',
      path: `/deployments/${deploymentId}/topology/config`
    });
    return PhoenixTopologySnapshot.import(rawdata);
  }

  /**
    *  Gets the topology tree for a given deployment and returns a
    *  PhoenixTopologySnapshot describing it.
    * This endpoint accepts 2 query parameters, category,
    * which will be used to filter vulnerabilities included in the resulting calculation.
    * ?category=config for configuration issues, ?category=security for security findings and scope,
    * ?scope=true for assets in scope (default behavior), ?category=false for all the asssets.
    * The returned format is the same, so rows are just rows of references to the data section.
    * The resulting threatiness on each asset is a live number based on the category filter applied.
    * If unfiltered (no category is provided) all vulnerabilities are included.
    * There is one *maybe* missing feature at this point,
    * which is the relative-ranked categorization by asset type (i.e. threat_level used for color-coding).
    * @param accountId
    * @param deploymentId
    * @param categories the remediations category. Only security and configuration are allowed for now
    * @param extraAssetTypes extras include (container, sg, load-balancer and image)
    * @param scope true|false to whether return all the assets or just the one in scope.
    * @remarks https://console.cloudinsight.alertlogic.com/api/assets_query/#api-Topology-GetOverviewTopology
    */
  async getOverviewTopologySnapshot(accountId: string,
    deploymentId: string,
    extraAssetTypes: string[] = [],
    categories: string[] = [],
    scope: boolean = true): Promise<PhoenixTopologySnapshot> {
    const rawdata = await this.client.get<PhoenixTopologySnapshot>({
      service_stack: AlLocation.InsightAPI,
      version: 'v1',
      account_id: accountId,
      service_name: 'assets_query',
      path: `/deployments/${deploymentId}/topology/overview`,
      params: {
        scope,
        ...(categories.length > 0 && { category: categories.join() }),
        ...(extraAssetTypes.length > 0 && { extras: extraAssetTypes.join() })
      }
    });
    return PhoenixTopologySnapshot.import(rawdata);
  }

  /**
   * Get Collection Health
   * GET
   * /remediations/v1/:account_id/health/:asset_type
   * "https://api.cloudinsight.alertlogic.com/remediations/v1/10000001/health/agent"
   * asset_type: agent, appliance, network, vpc
   */
  async getHealth(accountId: string, assetType: string, queryParams?: CollectionHealthQueryParams): Promise<HealthResponse> {
    return this.client.get<HealthResponse>({
      service_stack: AlLocation.InsightAPI,
      version: 'v1',
      account_id: accountId,
      service_name: 'remediations',
      path: `/health/${assetType}`,
      params: queryParams,
    });
  }

  /**
   * Get Collection Health Summary
   * GET
   * /remediations/v1/:account_id/health/summary
   * "https://api.cloudinsight.alertlogic.com/remediations/v1/10000001/health/summary"
   */
  async getHealthSummary(accountId: string, queryParams?: { scope?: boolean, filter?: string[] }): Promise<HealthSummaryResponse> {
    return this.client.get<HealthSummaryResponse>({
      service_stack: AlLocation.InsightAPI,
      version: 'v1',
      account_id: accountId,
      service_name: 'remediations',
      path: '/health/summary',
      params: queryParams,
    });
  }

  /**
   * Find Asset
   * GET
   * /assets_query/v1/:account_id/find
   * "https://api.cloudinsight.alertlogic.com/assets_query/v1/01000001/find?collector_type=agent&uuid=CD7C26C3-FAA1-4AD1-86CB-9628ED1B3327"
   */
  async findAsset(accountId: string, queryParams?: { uuid: string, collector_type?: string }): Promise<FoundAsset> {
    return this.client.get<FoundAsset>({
      service_stack: AlLocation.InsightAPI,
      version: 'v1',
      account_id: accountId,
      service_name: 'assets_query',
      path: '/find',
      params: queryParams,
    });
  }

  /**
   * Find Asset
   * GET
   * /assets_query/v1/:account_id/find
   * "https://api.cloudinsight.alertlogic.com/assets_query/v1/01000001/find?collector_type=agent&uuid=CD7C26C3-FAA1-4AD1-86CB-9628ED1B3327"
   */
  async findAssets(accountId: string, queryParams?: FindAssetsRequest): Promise<FoundAsset[]> {
    return this.client.get<FoundAsset[]>({
      service_stack: AlLocation.InsightAPI,
      version: 'v1',
      account_id: accountId,
      service_name: 'assets_query',
      path: '/find',
      params: queryParams,
    });
  }

  /**
   * Get Asset Details
   * GET
   * /assets_query/v1/:account_id/details
   * "https://api.cloudinsight.alertlogic.com/assets_query/v1/12345678/details?type=host&key=id:i-0fa67ce21528409bc&deployment=aws:1234567890®ion=id:us-east-2"
   */
  async getAssetDetails(
    accountId: string,
    queryParams?: {
      type?: string, key?: string,
      deployment?: string, region?: string,
      appliance_uuid?: string, ip_address?: string,
      port?: string, host_uuid?: string
    }): Promise<GenericResponse> {
    return this.client.get<GenericResponse>({
      service_stack: AlLocation.InsightAPI,
      version: 'v1',
      account_id: accountId,
      service_name: 'assets_query',
      path: '/details',
      params: queryParams,
    });
  }

  /**
   * Get Assets for Account
   * GET
   * /assets_query/v1/:account_id/assets
   * "https://api.cloudinsight.alertlogic.com/assets_query/v1/01000001/assets"
   */
  async getAccountAssets(accountId: string, queryParams?: AssetsQueryParams): Promise<AssetQueryGeneralResponse> {
    return this.client.get<AssetQueryGeneralResponse>({
      service_stack: AlLocation.InsightAPI,
      version: 'v1',
      account_id: accountId,
      service_name: 'assets_query',
      path: '/assets',
      params: queryParams,
    });
  }

  /**
   * Get Assets in Deployment
   * GET
   * /assets_query/v1/:account_id/deployments/:deployment_id/assets
   * "https://api.cloudinsight.alertlogic.com/assets_query/v1/01000001/deployments/1C0EFEC8-7DBE-480D-A025-ECC13DE30AD5/assets"
   */
  async getDeploymentAssets(accountId: string, deploymentId: string, queryParams?: AssetsQueryParams): Promise<AssetQueryGeneralResponse> {
    return this.client.get<AssetQueryGeneralResponse>({
      service_stack: AlLocation.InsightAPI,
      version: 'v1',
      account_id: accountId,
      service_name: 'assets_query',
      path: `/deployments/${deploymentId}/assets`,
      params: queryParams,
    });
  }

  async getExposuresSummary(accountId: string,
    qParams: ExposuresCountSummaryQueryParams): Promise<ExposuresCountSummary> {
    return this.client.get<ExposuresCountSummary>({
      service_stack: AlLocation.InsightAPI,
      version: 'v2',
      account_id: accountId,
      service_name: 'assets_query',
      path: '/exposures',
      params: qParams,
    });
  }

  /**
   * Get Tags Summary
   * Get a summary of all tags, with normalized keys, across all deployments. This endpoint should be preferred for use-cases that span deployments, like asset groups.
   * GET
   * /assets_query/v1/:account_id/tags/summary
   * "https://api.cloudinsight.alertlogic.com/assets_query/v1/12345678/tags/summary?include_tagged_assets=true"
   */
  async getTagsSummary(accountId: string, includeTaggedAssets: boolean = false): Promise<TagsSummaryResponse> {
    return this.client.get<TagsSummaryResponse>({
      service_stack: AlLocation.InsightAPI,
      version: 'v1',
      account_id: accountId,
      service_name: 'assets_query',
      path: '/tags/summary',
      params: includeTaggedAssets ? { ['include_tagged_assets']: includeTaggedAssets } : {}
    });

  }

  /**
   * Topology Query
   * GET
   * /assets_query/v1/:account_id/deployments/:deployment_id/topology
   * "https://api.cloudinsight.alertlogic.com/assets_query/v1/19000001/deployments/814C2911-09BB-1005-9916-7831C1BAC182/topology"
   */
  async getTopology(accountId: string, deploymentId: string,
    queryParams?: {
      include_filters?: boolean,
      include_remediations?: boolean,
      disposed?: string, extras?: string
    }): Promise<TopologyResponse> {
    return this.client.get<TopologyResponse>({
      service_stack: AlLocation.InsightAPI,
      version: 'v1',
      account_id: accountId,
      service_name: 'assets_query',
      path: `/deployments/${deploymentId}/topology`,
      params: queryParams,
    });
  }

  /**
   * Get Assessment Specs
   * GET
   * /remediations/v1/:account_id/deployments/:deployment_id/assessment-specs
   * "https://api.cloudinsight.alertlogic.com/remediations/v1/10000001/deployments/347203EF-134C-1005-8499-1289DB15AB31/assessment-specs"
   */
  async getAssessmentSpecs(accountId: string, deploymentId: string): Promise<GenericResponse> {
    return this.client.get<GenericResponse>({
      service_stack: AlLocation.InsightAPI,
      version: 'v1',
      account_id: accountId,
      service_name: 'remediations',
      path: `/deployments/${deploymentId}/assessment-specs`,
    });
  }

  /**
   * Remediation Items List
   * GET
   * /remediations/v1/:account_id/deployments/:deployment_id/remediation-items-list
   * "https://api.cloudinsight.alertlogic.com/remediations/v1/10000001/deployments/347203EF-134C-1005-8499-1289DB15AB31/remediation-items-list"
   */
  async getRemediationItemsList(accountId: string, deploymentId: string): Promise<RemediationsItemsListResponse> {
    return this.client.get<RemediationsItemsListResponse>({
      service_stack: AlLocation.InsightAPI,
      version: 'v1',
      account_id: accountId,
      service_name: 'remediations',
      path: `/deployments/${deploymentId}/remediation-items-list`,
    });
  }

  /**
   * Remediation Items Query
   * GET
   * /remediations/v1/:account_id/deployments/:deployment_id/remediation-items
   * "https://api.cloudinsight.alertlogic.com/remediations/v1/10000001/deployments/347203EF-134C-1005-8499-1289DB15AB31/remediation-items"
   */
  async getRemediationItems(accountId: string, deploymentId: string): Promise<GenericResponse> {
    return this.client.get<GenericResponse>({
      service_stack: AlLocation.InsightAPI,
      version: 'v1',
      account_id: accountId,
      service_name: 'remediations',
      path: `/deployments/${deploymentId}/remediation-items`,
    });
  }

  /**
   * Complete Remediations
   * PUT
   * /remediations/v1/:account_id/deployments/:deployment_id/remediations
   * "https://api.cloudinsight.alertlogic.com/remediations/v1/10000001/deployments/347203EF-134C-1005-8499-1289DB15AB31/remediations"
   * -d '{"operation": "complete_remediations", "remediation_items": ["/al/15000001:814C2911-09BB-1005-9916-7831C1BAC182/remediation-item/0536575B914C32C8A5D28415D02E4545"]}
   */
  async completeRemediations(accountId: string, deploymentId: string,
    remediationData: { operation: string, remediation_items: string[] }): Promise<any> {
    return this.client.put<any>({
      service_stack: AlLocation.InsightAPI,
      version: 'v1',
      account_id: accountId,
      service_name: 'remediations',
      path: `/deployments/${deploymentId}/remediations`,
      data: remediationData,
    });
  }

  /**
   * Dispose Remediations
   * PUT
   * /assets_query/v2/:account_id/remediations
   * "https://api.cloudinsight.alertlogic.com/assets_query/v2/10000001/remediations"
   * -d '{"operation": "dispose_remediations", "reason": "Acceptable Risk",
   * "comment": "This risk is acceptable", "expires": 0,
   * "remediation_ids": ["ids_upgrade_hardware"], "deployment_ids":["0A2DC25F-5B5A-4A93-9413-1A8D6F87489E"], filters:[]}'
   */
  async disposeRemediations(accountId: string, remediationData: {
    deployment_ids?: string[], filters: string[] | string[][],
    vulnerability_ids?: string[], remediation_ids?: string[], reason: string,
    comment: string, expires?: number, applies_to_specific_assets?: boolean, filter_match_mode?: string
  }): Promise<RemediationsItemsListResponse> {
    let baseRemediationData = { operation: 'dispose_remediations' };
    Object.assign(baseRemediationData, remediationData);
    return this.client.put<RemediationsItemsListResponse>({
      service_stack: AlLocation.InsightAPI,
      account_id: accountId,
      service_name: 'assets_query',
      path: 'remediations',
      version: 'v2',
      data: baseRemediationData,
    });
  }

  /**
   * Uncomplete Remediations
   * PUT
   * /remediations/v1/:account_id/deployments/:deployment_id/remediations
   * "https://api.cloudinsight.alertlogic.com/remediations/v1/10000001/deployments/347203EF-134C-1005-8499-1289DB15AB31/remediations"
   * -d '{"operation": "uncomplete_remediations", "remediation_itemss": ["/al/15000001:814C2911-09BB-1005-9916-7831C1BAC182/remediation-item/0536575B914C32C8A5D28415D02E4545"]}
   */
  async uncompleteRemediations(accountId: string, deploymentId: string,
    remediationData: { operation: string, remediation_items: string[] }): Promise<any> {
    return this.client.put<any>({
      service_stack: AlLocation.InsightAPI,
      version: 'v1',
      account_id: accountId,
      service_name: 'remediations',
      path: `/deployments/${deploymentId}/remediations`,
      data: remediationData,
    });
  }

  /**
   * Undispose Remediations
   * @deprecated use undisposeRemediationItems insetad.
   * DELETE
   * /remediations/v1/:account_id/remediations
   * https://api.cloudinsight.alertlogic.com/remediations/v1/12345678/remediations?remediation_item_ids=0536575B914C32C8A5D28415D02E4545"
   */
  async undisposeRemediations(accountId: string, queryParams?: {
    audit_ids?: string, deployment_ids?: string, remediation_item_ids?: string,
    remediation_ids?: string, vulnerability_ids?: string,
  }): Promise<any> {
    return this.client.delete<any>({
      service_stack: AlLocation.InsightAPI,
      account_id: accountId,
      service_name: 'assets_query',
      path: '/remediations',
      params: queryParams,
      version: 'v2'
    });
  }

  async undisposeRemediationItems(accountId: string, remediationData: UndisposeRemediationsRequestBody): Promise<RemediationsItemsListResponse> {
    let baseRemediationData: UndisposeRemediationsRequestBody = { operation: 'undispose_remediations' };
    Object.assign(baseRemediationData, remediationData);
    return this.client.put<RemediationsItemsListResponse>({
      service_stack: AlLocation.InsightAPI,
      account_id: accountId,
      service_name: 'assets_query',
      path: 'remediations',
      version: 'v2',
      data: baseRemediationData,
    });
  }

  /**
   * Plan Remediations
   * PUT
   * /remediations/v1/:account_id/deployments/:deployment_id/remediations
   * "https://api.cloudinsight.alertlogic.com/remediations/v1/10000001/deployments/347203EF-134C-1005-8499-1289DB15AB31/remediations"
   * -d '{"operation": "plan_remediations",
   *      "filters": ["stuff"],
   *      "user_id": "0987",
   *      "remediations": ["/al/15000001:814C2911-09BB-1005-9916-7831C1BAC182/remediation-item/0536575B914C32C8A5D28415D02E4545"]}
   */
  async planRemediations(
    accountId: string,
    deploymentId: string,
    remediationData: { operation: string, filters: string[], user_id: string, remediations: string[] },
  ): Promise<any> {
    return this.client.put<any>({
      service_stack: AlLocation.InsightAPI,
      version: 'v1',
      account_id: accountId,
      service_name: 'remediations',
      path: `/deployments/${deploymentId}/remediations`,
      data: remediationData,
    });
  }

  /**
   * Exposures Deployment Summary
   * GET
   * /assets_query/v1/:account_id/exposures/deployment/summary
   * "https://api.cloudinsight.alertlogic.com/assets_query/v2/10000001/exposures/deployment/summary"
   */
  async getExposuresDeploymentSummary(accountId: string, queryParams?: ExposureQueryParams): Promise<ExposuresSummary> {
    return this.client.get<ExposuresSummary>({
      service_stack: AlLocation.InsightAPI,
      account_id: accountId,
      service_name: 'assets_query',
      path: 'exposures/deployment/summary',
      version: 'v2',
      params: queryParams,
    });

  }

  /**
   * Exposures Query
   * GET
   * /assets_query/v2/:account_id/exposures
   * "https://api.cloudinsight.alertlogic.com/assets_query/v2/10000001/exposures"
   */
  async queryExposures(accountId: string, queryParams?: ExposureQueryParams): Promise<ExposuresQueryResponse> {
    return this.client.get<ExposuresQueryResponse>({
      service_stack: AlLocation.InsightAPI,
      account_id: accountId,
      service_name: 'assets_query',
      path: 'exposures',
      version: 'v2',
      params: queryParams,
    });
  }


  /**
   * Remediations Conclude API
   * PUT
   * /assets_query/v2/:account_id/remediations
   * "https://api.cloudinsight.alertlogic.com/assets_query/v2/10000001/remediations"
   *  -d '{"operation": "conclude_remediations", "remediation_ids": ["ids_upgrade_hardware"], "deployment_ids":["0A2DC25F-5B5A-4A93-9413-1A8D6F87489E"], filters:[]}
   */
  async concludeRemediations(accountId: string,
    remediationData: {
      deployment_ids?: string[], filters: string[] | string[][], vulnerability_ids?: string[],
      remediation_ids?: string[], applies_to_specific_assets?: boolean, filter_match_mode?: string
    }): Promise<RemediationsItemsListResponse> {
    let baseRemediationData = { operation: 'conclude_remediations' };
    Object.assign(baseRemediationData, remediationData);
    return this.client.put<RemediationsItemsListResponse>({
      service_stack: AlLocation.InsightAPI,
      account_id: accountId,
      service_name: 'assets_query',
      path: 'remediations',
      version: 'v2',
      data: baseRemediationData,
    });
  }

  /**
   * Query Remediation Items
   * GET
   * /assets_query/v2/:account_id/remediation-items
   * "https://api.cloudinsight.alertlogic.com/assets_query/v2/10000001/remediation-items"
   */
  async queryRemediationItems(accountId: string, queryParams?: RemediationItemsQueryParams): Promise<RemediationItemsQueryResponse> {
    return this.client.get<RemediationItemsQueryResponse>({
      service_stack: AlLocation.InsightAPI,
      account_id: accountId,
      service_name: 'assets_query',
      path: 'remediation-items',
      version: 'v2',
      params: queryParams,
    });
  }

  /**
   * Create, Delete and Update an asset-group asset based on operation JSON property:
   * {
   *    "operation": "create_asset_group",
   *    "scope" : "user",
   *    ...
   *    }
   *  }
   * property value:
   * Create: operation = create_asset_group,
   * Delete: operation = delete_asset_group,
   * Update: operation = update_asset_group
   *
   * PUT
   * /assets_write/v1/:account_id/assets
   *
   * @param accountId The AIMS Account ID
   * @param payload Notification type object
   * @returns a promise with the asset-group that was created
   *
   * @remarks
   * URL: https://api.product.dev.alertlogic.com/assets_write/v1/01000001/assets
   * API: https://console.account.alertlogic.com/users/api/assets_write/#api-AssetGroupOperations
   */
  async assetGroupOperations(accountId: string, payload: AssetGroupPayload): Promise<AssetGroup> {
    return this.client.put<AssetGroup>({
      service_stack: AlLocation.InsightAPI,
      account_id: accountId,
      service_name: 'assets_query',
      path: 'asset_groups',
      version: 'v1',
      data: payload
    });
  }

  /**
   * Get Asset Group Topology
   * POST
   * /assets_query/v1/:account_id/topology/asset_group
   */
  async getAssetGroupTopology(accountId: string, requestParams: AssetGroupTopologyQueryParams): Promise<AssetGroupTopologyResponse> {
    return this.client.post<AssetGroupTopologyResponse>({
      service_stack: AlLocation.InsightAPI,
      account_id: accountId,
      service_name: 'assets_query',
      path: 'topology/asset_group',
      version: 'v1',
      data: requestParams
    });
  }

  /**
   * List Asset Groups
   * GET
   * /assets_query/v1/:account_id/asset_groups
   */
  async listAssetGroups(accountId: string): Promise<AssetGroupListResponse> {
    return this.client.get<AssetGroupListResponse>({
      service_stack: AlLocation.InsightAPI,
      account_id: accountId,
      service_name: 'assets_query',
      path: 'asset_groups',
      version: 'v1'
    });
  }

  /**
   * Fetches the "schema" for asset types. The schema describes the structure for asset types.
   * GET
   * /asset_query/v1/asset_types
   */
  async getAssetTypes(queryParams: { filter?: string, fields?: string, format?: string }): Promise<AssetTypesResponse> {
    return this.client.get<AssetTypesResponse>({
      service_stack: AlLocation.InsightAPI,
      service_name: 'assets_query',
      path: 'asset_types',
      version: 'v1',
      params: queryParams,
    });
  }

  /**
   * Delete Asset Group
   * PUT
   * /assets_query/v1/:account_id/asset_groups
   */
  async deleteAssetGroup(accountId: string, name: string, dryRun: boolean = false): Promise<DeleteAssetGroupResponse> {
    return this.client.put<DeleteAssetGroupResponse>({
      service_stack: AlLocation.InsightAPI,
      account_id: accountId,
      service_name: 'assets_query',
      path: 'asset_groups',
      version: 'v1',
      data: {
        name,
        operation: 'delete_asset_group',
        scope: 'user',
        dry_run: dryRun
      }
    });
  }

  /**
   * Retrieves incident IDs associated with the specified assets.
   * POST
   * /assets_query/v1/:account_id/incident_ids
   * @param {string} accountId - The ID of the account to query.
   * @param {AssetsQueryIncidentIdsPayload} payload - The payload for the request, including the list of assets and limit.
   * @returns {Promise<AssetsQueryIncidentIdsResponse>} - A promise that resolves with an object containing incident IDs by asset.
   */
  async getIncidentsIdsByAsset(accountId: string, payload: AssetsQueryIncidentIdsPayload): Promise<AssetsQueryIncidentIdsResponse> {
    return this.client.post({
      service_stack: AlLocation.InsightAPI,
      account_id: accountId,
      service_name: 'assets_query',
      path: 'incident_ids',
      version: 'v1',
      data: payload
    });
  }
}
