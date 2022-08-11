import {
    AlApiClient,
    AlDefaultClient,
    AlLocation
} from '@al/core';

import { WatchList } from './types';


export class AlWatchlistClientInstance {

    private serviceName = 'watchlist';
    private serviceVersion = 'v1';

    /* istanbul ignore next */
    constructor(public client: AlApiClient = AlDefaultClient) { }

    async add(accountId: string, deploymentId: string, userId: string, assetKey: string): Promise<WatchList> {
        const rawResponse = await this.client.post({
            service_stack: AlLocation.InsightAPI,
            version: this.serviceVersion,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/${userId}`,
            data: {
                key: assetKey,
                environment_id: deploymentId
            }
        });
        return (rawResponse?.watchlist ?? {}) as WatchList;
    }

    async remove(accountId: string, userId: string, assetKey: string): Promise<void> {
        return this.client.delete({
            service_stack: AlLocation.InsightAPI,
            version: this.serviceVersion,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/${userId}/${assetKey}`
        });
    }

}
