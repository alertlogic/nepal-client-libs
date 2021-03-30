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
    RemediationItemsQueryParams,
    RemediationItemsQueryResponse,

} from './types';

export class AlAssetsQueryV2ClientInstance {

    private readonly version: string = 'v2';

    /* istanbul ignore next */
    constructor(public client: AlApiClient = AlDefaultClient) {
    }

    async getExposuresSummary(accountId: string,
        qParams: ExposuresCountSummaryQueryParams): Promise<ExposuresCountSummary> {
        return this.client.get<ExposuresCountSummary>({
            service_stack: AlLocation.InsightAPI,
            version: this.version,
            account_id: accountId,
            service_name: 'assets_query',
            path: '/exposures',
            params: qParams,
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
        deployment_ids?: string[], filters: string[] | string[][], vulnerability_ids?: string[], remediation_ids?: string[], reason: string,
        comment: string, expires?: number, applies_to_specific_assets?: boolean
    }) {
        let baseRemediationData = { operation: 'dispose_remediations' };
        Object.assign(baseRemediationData, remediationData);
        return this.client.put<any>({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: 'assets_query',
            path: 'remediations',
            version: this.version,
            data: baseRemediationData,
        });
    }

    /**
     * Undispose Remediations
     * DELETE
     * /remediations/v1/:account_id/remediations
     * https://api.cloudinsight.alertlogic.com/remediations/v1/12345678/remediations?remediation_item_ids=0536575B914C32C8A5D28415D02E4545"
     */
    async undisposeRemediations(accountId: string, queryParams?: {
        audit_ids?: string, deployment_ids?: string, remediation_item_ids?: string,
        remediation_ids?: string, vulnerability_ids?: string,
    }) {
        return this.client.delete<any>({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: 'assets_query',
            path: '/remediations',
            params: queryParams,
            version: this.version
        });
    }

    /**
     * Exposures Deployment Summary
     * GET
     * /assets_query/v1/:account_id/exposures/deployment/summary
     * "https://api.cloudinsight.alertlogic.com/assets_query/v2/10000001/exposures/deployment/summary"
     */
    async getExposuresDeploymentSummary(accountId: string, queryParams?: ExposureQueryParams) {
        return this.client.get<ExposuresSummary>({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: 'assets_query',
            path: 'exposures/deployment/summary',
            version: this.version,
            params: queryParams,
        });

    }

    /**
     * Exposures Query
     * GET
     * /assets_query/v2/:account_id/exposures
     * "https://api.cloudinsight.alertlogic.com/assets_query/v2/10000001/exposures"
     */
    async queryExposures(accountId: string, queryParams?: ExposureQueryParams) {
        return this.client.get<ExposuresQueryResponse>({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: 'assets_query',
            path: 'exposures',
            version: this.version,
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
    async concludeRemediations(accountId: string, remediationData: {
        deployment_ids?: string[], filters: string[] | string[][], vulnerability_ids?: string[],
        remediation_ids?: string[], applies_to_specific_assets?: boolean
    }) {
        let baseRemediationData = { operation: 'conclude_remediations' };
        Object.assign(baseRemediationData, remediationData);
        return this.client.put<any>({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: 'assets_query',
            path: 'remediations',
            version: this.version,
            data: baseRemediationData,
        });
    }

    /**
     * Query Remediation Items
     * GET
     * /assets_query/v2/:account_id/remediation-items
     * "https://api.cloudinsight.alertlogic.com/assets_query/v2/10000001/remediation-items"
     */
    async queryRemediationItems(accountId: string, queryParams?: RemediationItemsQueryParams) {
        return this.client.get<RemediationItemsQueryResponse>({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: 'assets_query',
            path: 'remediation-items',
            version: this.version,
            params: queryParams,
        });
    }

}

