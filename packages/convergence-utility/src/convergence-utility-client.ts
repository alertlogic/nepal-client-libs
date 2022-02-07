import {
    AlApiClient,
    AlDefaultClient,
    AlLocation
} from '@al/core';

import { CollectionFilters, LookedUpUsers } from './types';

export class ConvergenceUtilityClientInstance {

    private readonly serviceName:string = 'convergence';
    private readonly serviceVersion:string = 'v2';
    private readonly serviceStack:string = AlLocation.LegacyUI;

    public constructor(public client: AlApiClient = AlDefaultClient) {
    }

    public async addToCase(accountId: string, data: {id: string, type: string}): Promise<any> {
        return this.client.post({
            data,
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/utility/case/add`
        });
    }

    public async getFiltersByEntityType(accountId: string, entityType: string): Promise<CollectionFilters> {
        return this.client.get<CollectionFilters>({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/utilities/filters/${entityType}`,
        });
    }

    public async lookUpUsers(accountId: string, userIds: string[]): Promise<LookedUpUsers> {
        const users: string = userIds.join(',');
        return this.client.get<LookedUpUsers>({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/utility/userlookup`,
            params: { users }
        });
    }

    public async getDownloads( accountId:string, product:string ): Promise<any> {
        return this.client.get<any>({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/${accountId}/utilities/downloads/${product}`,
        });
    }

    public async getApiKey( accountId:string ): Promise<any> {
        return this.client.get<any>({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `${accountId}/apikey`,
        });
    }
}
