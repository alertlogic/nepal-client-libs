import { AlApiClient, AlDefaultClient, AlLocation } from '@al/core';

export class AertaClientInstance {
    private serviceName = 'aerta';

    public constructor(public client: AlApiClient = AlDefaultClient) {
    }

    /**
     * Get RTA
     * GET
     *
     * @param path string RTA path
     * @param timestamp Epoch/Unix Timestamp
     */
    public async getByPath(path: string, timestamp: number) {
        return this.client.get<any>({
            service_name: this.serviceName,
            path: `/rtas/paths/${path}`,
            version: 'v1',
            params: { ts: timestamp }
        });
    }
}

