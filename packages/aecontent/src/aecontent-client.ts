import { AlApiClient, AlDefaultClient, AlLocation } from '@al/core';

export class AecontentClientInstance {
    private serviceName = 'aecontent';

    public constructor(public client: AlApiClient = AlDefaultClient) {
    }

    /**
     * Get Observation
     * GET
     *
     * @param accountId
     * @param path string observation path
     * @param timestamp Epoch/Unix Timestamp
     */
    public async getByPath(accountId: string, path: string, timestamp: number) {
        return this.client.get<any>({
            account_id: accountId,
            service_name: this.serviceName,
            service_stack: AlLocation.GlobalAPI,
            path: `/observations/paths/${path}`,
            version: 'v1',
            params: { ts: timestamp }
        });
    }
}

