import {
    AlApiClient,
    AlDefaultClient,
    AlLocation
} from '@al/core';

import {
    CloudExplorerAwsRegionRecord,
    CollectionFiltersResponse,
    CollectionPolicy,
    CollectionsGenericResponse,
    CollectionSource,
    ConvergenceQueryParams,
    LookedUpUsersResponse,
    PolicyType
} from './types';

export class ConvergenceUtilityClientInstance {

    private readonly serviceName: string = 'convergence';
    private readonly serviceVersion: string = 'v2';
    private readonly serviceStack: string = AlLocation.LegacyUI;

    public constructor(public client: AlApiClient = AlDefaultClient) {
    }

    public async listHosts(
        accountId: string,
        deploymentId: string,
        productType: string,
        params: ConvergenceQueryParams,
        action?: 'massedit' | 'deleted'): Promise<CollectionsGenericResponse> {
        if (productType === "lm") {
            productType = "lmhosts";
        } else if (productType === "tm") {
            productType = "tmhosts";
        }
        if (action) {
            productType += "_" + action;
        }
        return this.client.get({
            params,
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/datacenter/deployments/${deploymentId}/${productType}`
        });
    }

    public async listCredentials(
        accountId: string,
        params: ConvergenceQueryParams): Promise<CollectionsGenericResponse> {
        return this.client.get({
            params,
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/credentials`
        });
    }

    public async listAlertRules(
        accountId: string,
        productType: string,
        params: ConvergenceQueryParams
    ): Promise<CollectionsGenericResponse> {
        if (productType === "log-collection") {
            productType = "lm_collection";
        } else if (productType === "intrusion-detection") {
            productType = "tm_collection";
        }
        return this.client.get({
            params,
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/alertrules/${productType}`
        });
    }

    public async getOnePolicy(
        accountId: string,
        policyType: PolicyType,
        policyId: string): Promise<CollectionPolicy> {
        return this.client.get({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/policies/${policyType}/${policyId}`
        });
    }

    public async listPolicies(
        accountId: string,
        policyType: PolicyType,
        params: ConvergenceQueryParams): Promise<CollectionsGenericResponse> {
        return this.client.get({
            params,
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/policies/${policyType}`
        });
    }

    public async updateCollector(
        accountId: string,
        deploymentId: string,
        collectorId: string,
        data: any): Promise<CollectionSource> {
        return this.client.put({
            data,
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/deployments/${deploymentId}/collectors/${collectorId}`
        });
    }

    public async getOneCollector(
        accountId: string,
        deploymentId: string,
        collectorId: string): Promise<CollectionSource> {
        return this.client.get({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/deployments/${deploymentId}/collectors/${collectorId}`
        });
    }

    public async listCollectors(
        accountId: string,
        deploymentId: string,
        params: { [i: string]: number | string | boolean }): Promise<CollectionsGenericResponse> {
        return this.client.get({
            params,
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/deployments/${deploymentId}/collectors`
        });
    }

    public async createCollection(
        accountId: string,
        deploymentId: string,
        data: any,
        entityType: string = 'collection'
    ): Promise<CollectionsGenericResponse> {
        return this.client.post({
            data,
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/deployments/${deploymentId}/${entityType}`
        });
    }

    public async updateCollection(
        accountId: string,
        deploymentId: string,
        collectionId: string,
        data: any,
        entityType: string = 'collection'): Promise<CollectionsGenericResponse> {
        return this.client.put({
            data,
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/deployments/${deploymentId}/${entityType}/${collectionId}`
        });
    }

    public async getCloudExplorerAwsRegions(accountId: string): Promise<CloudExplorerAwsRegionRecord[]> {
        return this.client.get({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/cloud-explorer/regions`
        });
    }

    public async deleteCollectionSource(
        accountId: string,
        deploymentId: string,
        collectionId: string,
        entityType: string = 'collection'): Promise<void> {
        return this.client.delete({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/deployments/${deploymentId}/${entityType}/${collectionId}`
        });
    }

    public async getCollectionSource(
        accountId: string,
        deploymentId: string,
        collectionId: string,
        entityType: string = 'collection'): Promise<CollectionSource> {
        return this.client.get({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/deployments/${deploymentId}/${entityType}/${collectionId}`
        });
    }

    public async listCollectionSources(
        accountId: string,
        deploymentId: string,
        params: ConvergenceQueryParams,
        entityType: string = 'collection'): Promise<CollectionsGenericResponse> {
        return this.client.get({
            params,
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/deployments/${deploymentId}/${entityType}`
        });
    }

    public async addToCase(accountId: string, data: { id: string, type: string }): Promise<any> {
        return this.client.post({
            data,
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/utility/case/add`
        });
    }

    public async getFiltersByEntityType(accountId: string, entityType: string): Promise<CollectionFiltersResponse> {
        return this.client.get<CollectionFiltersResponse>({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/utilities/filters/${entityType}`,
        });
    }

    public async lookUpUsers(accountId: string, userIds: string[]): Promise<LookedUpUsersResponse> {
        const users: string = userIds.join(',');
        return this.client.get<LookedUpUsersResponse>({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/utility/userlookup`,
            params: { users }
        });
    }

    public async getDownloads(accountId: string, product: string): Promise<any> {
        return this.client.get<any>({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/${accountId}/utilities/downloads/${product}`,
        });
    }

    public async getApiKey(accountId: string): Promise<any> {
        return this.client.get<any>({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `${accountId}/apikey`,
        });
    }
}
