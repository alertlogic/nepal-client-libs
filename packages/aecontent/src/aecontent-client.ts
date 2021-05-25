import { AlApiClient, AlDefaultClient, AlLocation } from '@al/core';

export class AecontentClientInstance {
    private serviceName = 'aecontent';

    public constructor(public client: AlApiClient = AlDefaultClient) {
    }

    /**
     * Get Observation
     * GET
     *
     * @param path string observation path
     * @param timestamp Epoch/Unix Timestamp
     */
    public async getByPath(path: string, timestamp: number) {
        return this.client.get<any>({
            service_name: this.serviceName,
            service_stack: AlLocation.GlobalAPI,
            path: `/observations/paths/${path}`,
            version: 'v1',
            params: { ts: timestamp }
        });
    }
}

