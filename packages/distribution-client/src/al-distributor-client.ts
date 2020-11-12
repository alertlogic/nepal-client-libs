/**
 * Distributor API client
 */
import {
    AlApiClient,
    AlDefaultClient,
    AlLocation
} from '@al/core';


export class AlDistributorClientInstance {

    protected client: AlApiClient;
    protected serviceStack = AlLocation.DistributorAPI;

    constructor(client: AlApiClient = null) {
        this.client = client || AlDefaultClient;
    }

    /**
     * Download firewall rules
     * GET
     * /v1/{account_id}/
     * https://distributor.mdr.global.alertlogic.com
     *
     * @remarks
     *
     * */
    async downloadFirewallRules(accountId: string, path: string, version: string = 'v1') {
        return this.client.get<any>({
            path,
            version: version,
            service_stack: this.serviceStack,
            account_id: accountId
        });
    }
}
