import { AlApiClient, AlDefaultClient, AlLocation } from '@al/core';

export class AertaClientInstance {
    private serviceName = 'aerta';

    public constructor(public client: AlApiClient = AlDefaultClient) {
    }

    /**
     * Get RTA
     * GET
     *
     * @param accountId
     * @param path string RTA path
     * @param dataType logmsgs, telemetry, etc
     * @param timestamp Epoch/Unix Timestamp
     */
    public async get(accountId: string, path: string, dataType: string, timestamp: number) {
        return this.client.get<any>({
            account_id: accountId,
            service_name: this.serviceName,
            service_stack: AlLocation.GlobalAPI,
            path: '/rtas',
            version: 'v1',
            params: { path, ts: timestamp, account_id: accountId }
        });
    }
}

