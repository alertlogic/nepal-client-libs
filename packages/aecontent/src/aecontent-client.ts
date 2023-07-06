import { AlApiClient, AlDefaultClient, AlLocation } from '@al/core';
import { AlTuningRule } from './types/aecontent-client-tuning.type';

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
    public async getByPath(path: string, timestamp: number): Promise<any> {
        return this.client.get<any>({
            service_name: this.serviceName,
            path: `/observations/paths/${path}`,
            version: 'v1',
            params: { ts: timestamp }
        });
    }

    /**
     * create Tuning rule
     * POST
     *
     * @param accountId string tuning rule's belonging account id
     *
     */
    public async createRule(accountId: string, data: AlTuningRule): Promise<any> {
        return this.client.post<any>({
            data,
            service_name: this.serviceName,
            path: `${accountId}/tunings`,
            version: 'v1'
        });
    }

    /**
     * delete Tuning rule
     * DELETE
     *
     * @param accountId string tuning rule's belonging account id
     * @param name string tuning rule's name
     *
     */
    public async deleteRule(accountId: string, name: string): Promise<any> {
        return this.client.get<any>({
            service_name: this.serviceName,
            path: `${accountId}/tunings`,
            version: 'v1',
            params: {
                        ruleName: name
                    }
        });
    }

    /**
     * Get Tuning rule
     * GET
     *
     * @param accountId string tuning rule's belonging account id
     * @param name string tuning rule's name
     *
     */
    public async getRule(accountId: string, name: string): Promise<any> {
        return this.client.get<any>({
            service_name: this.serviceName,
            path: `${accountId}/tunings`,
            version: 'v1',
            params: {
                        ruleName: name
                    }
        });
    }
}

