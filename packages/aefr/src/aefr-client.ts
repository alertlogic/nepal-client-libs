import { AlApiClient, AlDefaultClient, AlLocation } from '@al/core';

export class AefrClientInstance {
    private serviceName = 'aefr';

    public constructor(public client: AlApiClient = AlDefaultClient) {
    }

    /**
     * Get Trigger
     * GET
     *
     * @param path string trigger path
     * @param timestamp Epoch/Unix Timestamp
     */
    public async getByPath(path: string, timestamp: number) {
        return this.client.get<any>({
            service_name: this.serviceName,
            path: `/triggers/paths/${path}`,
            version: 'v1',
            params: { ts: timestamp }
        });
    }
}

