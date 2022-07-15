import {
    AlApiClient,
    AlDefaultClient,
    AlLocation
} from "@al/core";

import {
    SercaSeachResult
} from "./types";

export class AlSercaClientInstance {
    protected client: AlApiClient;
    protected serviceName = 'serca';
    protected serviceVersion = 'v1';

    constructor(client?: AlApiClient) {
        this.client = client || AlDefaultClient;
    }

    /**
     * @remarks https://api.global-integration.product.dev.alertlogic.com/serca/v1/134249236/search
     */
    async search(accountId: string, query: string, queryParams?: { [i: string]: unknown }): Promise<SercaSeachResult> {
        const rawData = this.client.post({
            data:query,
            service_stack: AlLocation.InsightAPI,
            version: this.serviceVersion,
            service_name: this.serviceName,
            account_id: accountId,
            path: "search",
            params: queryParams
        });
        return rawData;
    }
}
