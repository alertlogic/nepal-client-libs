import { AlApiClient, AlDefaultClient } from '@al/core';

export class AegraphClientInstance {
    private serviceName = 'aegraph';

    public constructor(public client: AlApiClient = AlDefaultClient) {
    }

    public async getByRange(cid: number, timestamp: { start: number, end: number }, filters?: {[k:string]:string}): Promise<any> {
        return this.client.get<any>({
            service_name: this.serviceName,
            path: `/${cid}/graphs/`,
            version: 'v1',
            params: {
                start_ts: timestamp.start,
                end_ts: timestamp.end,
                ...filters
            },
        });
    }
}

