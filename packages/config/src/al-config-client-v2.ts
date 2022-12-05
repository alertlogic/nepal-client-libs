/**
 * Config V2 Public API endpoints Implementation
 */
import {
    AlApiClient,
    AlDefaultClient,
    AlLocation
} from '@al/core';
import { AlConfig } from './types';

export class AlConfigClientV2 {
    protected serviceVersion = 'v2';
    protected serviceName = 'config'

    constructor(public client: AlApiClient = AlDefaultClient) {}

    listConfigs(accountId: string, qParams: {[key:string]: string|Object}): Promise<AlConfig[]> {
        return this.client.get({
            service_stack: AlLocation.InsightAPI,
            version: 'v2',
            service_name: 'config',
            account_id: accountId,
            path: `/configs`,
            params: qParams
        });
    }
}
