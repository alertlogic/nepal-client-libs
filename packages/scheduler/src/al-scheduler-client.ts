/**
 * Module to deal with available Sources Public API endpoints
 */
import {
    AlApiClient,
    AlDefaultClient,
} from '@al/core';
import {
    ScanStatusSummary,
    ScanTargetHost
} from './types';

export class AlSchedulerClientInstance {

    private serviceName = 'scheduler';
    /* istanbul ignore next */
    constructor(public client: AlApiClient = AlDefaultClient) {
    }

    async getScanStatusSummary(accountId: string, environmentId: string, queryParams?: {vpc_key: string}) {
        const summary = await this.client.fetch({
            service_name: this.serviceName,
            account_id: accountId,
            path: `${environmentId}/summary`,
            params: queryParams,
            version: 1
        });
        return summary as ScanStatusSummary;
    }

    async getTargetHosts(accountId: string, environmentId: string) {
        const hosts = await this.client.fetch({
            service_name: this.serviceName,
            account_id: accountId,
            path: `${environmentId}/targets`,
            version: 1
        });
        return hosts as ScanTargetHost;
    }

    async scanAsset(accountId: string, environmentId: string, assetKey: string) {
        const scan = await this.client.put({
            service_name: this.serviceName,
            account_id: accountId,
            path: `${environmentId}/scan`,
            data: {asset: assetKey},
            version: 1
        });
        return scan;
    }
}
