/**
 * Module to deal with available Analytic Engine's Tuner Public API endpoints
 */
import {
    AlApiClient,
    AlDefaultClient,
} from '@al/core';

export class AlAETunerClientInstance {

    private serviceName = 'aetuner';

    constructor(public client: AlApiClient = AlDefaultClient) {
    }

    async getIncidents( accountId: string ) {
        return this.client.get<any>({
            service_name: this.serviceName,
            account_id: accountId,
            version: 'v1',
            path: `/analytics`,
        });
    }

}
