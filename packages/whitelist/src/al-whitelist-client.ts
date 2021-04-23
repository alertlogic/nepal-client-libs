/**
 * Module to deal with available Deployments Public API endpoints
 */
import {
    AlApiClient,
    AlDefaultClient,
    AlLocation,
} from '@al/core';
import {
    WhiteListTag
} from './types';

export class AlwsWhitelistClientInstance {

    private serviceName = 'whitelist';
    private serviceVersion = 'v1';

    /* istanbul ignore next */
    constructor(public client: AlApiClient = AlDefaultClient) { }

    async listTags(accountId: string, deploymentId: string): Promise<WhiteListTag[]> {
        return this.client.get<WhiteListTag[]>({
            service_stack: AlLocation.InsightAPI,
            version: this.serviceVersion,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/${deploymentId}`
        });
    }

    async addTag(accountId: string, deploymentId: string, tag: WhiteListTag): Promise<WhiteListTag> {
        return this.client.post<WhiteListTag>({
            service_stack: AlLocation.InsightAPI,
            version: this.serviceVersion,
            service_name: this.serviceName,
            account_id: accountId,
            data: tag,
            path: `/${deploymentId}`
        });
    }

    async deleteTag(accountId: string, deploymentId: string, tag: WhiteListTag): Promise<void> {
        return this.client.delete({
            service_stack: AlLocation.InsightAPI,
            version: this.serviceVersion,
            service_name: this.serviceName,
            account_id: accountId,
            data: tag,
            path: `/${deploymentId}`
        });
    }
}
