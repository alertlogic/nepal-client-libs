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
     * Get Observation by path only
     * GET
     *
     * @param path string observation path
     */
    public async getObservationByPath(accountId: string, path: string): Promise<any> {
        return this.client.get<any>({
            service_name: this.serviceName,
            account_id: accountId,
            path: `/observations/paths/${path}`,
            version: 'v1',
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
    public async deleteRule(accountId: string, name: string): Promise<void> {
        return this.client.delete<void>({
            service_name: this.serviceName,
            path: `${accountId}/tunings`,
            version: 'v1',
            params: {
                        name: name
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
                        name: name
                    }
        });
    }

    /**
     * Get all rules from an account
     * GET
     *
     * @param accountId string tuning rule's belonging account id
     *
     */
    public async getAllRules(accountId: string, disabled?: boolean, deleted?: boolean): Promise<any> {
        return this.client.get<any>({
            service_name: this.serviceName,
            path: `${accountId}/tunings`,
            version: 'v1',
            params: {
                return_disabled: disabled,
                return_deleted: deleted
            }
        });
    }

    /**
     * enable a Tuning rule
     * POST
     *
     * @param accountId string tuning rule's belonging account id
     * @param name name of the rule to enable
     *
     */
    public async enableRule(accountId: string, name: string): Promise<any> {
        return this.client.post<any>({
            service_name: this.serviceName,
            path: `${accountId}/tunings/enable`,
            version: 'v1',
            params: {
                name: name
            }
        });
    }

    /**
     * disable a Tuning rule
     * POST
     *
     * @param accountId string tuning rule's belonging account id
     *  @param name name of the rule to disable
     *
     */
    public async disableRule(accountId: string, name: string): Promise<any> {
        return this.client.post<any>({
            service_name: this.serviceName,
            path: `${accountId}/tunings/disable`,
            version: 'v1',
            params: {
                name: name
            }
        });
    }

    /**
     * Get tuning schema data
     * GET
     *
     * @param properties string a property to specify part of the desired schema
     */
    public async getTuningSchema(properties?: string, version?: string): Promise<any> {
        return this.client.get<any>({
            service_name: this.serviceName,
            path: `/tunings/schema`,
            version: 'v1',
            params: {
                properties: properties,
                schema_version: version
            }
        });
    }
}

