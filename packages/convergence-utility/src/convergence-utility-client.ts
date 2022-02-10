import {
    AlApiClient,
    AlDefaultClient,
    AlLocation
} from '@al/core';

import { CloudExplorerAwsRegionRecord, CollectionFiltersResponse, CollectionResponse, CollectionSource, LookedUpUsersResponse } from './types';

export class ConvergenceUtilityClientInstance {

    private readonly serviceName: string = 'convergence';
    private readonly serviceVersion: string = 'v2';
    private readonly serviceStack: string = AlLocation.LegacyUI;

    public constructor(public client: AlApiClient = AlDefaultClient) {
    }

    public async createCollection(
        accountId: string,
        deploymentId: string,
        data: any,
        entityType: string = 'collection'
    ): Promise<CollectionResponse> {
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
        entityType: string = 'collection'): Promise<CollectionResponse> {
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
        params: { [i: string]: string | number | boolean },
        entityType: string = 'collection'): Promise<CollectionResponse> {
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
