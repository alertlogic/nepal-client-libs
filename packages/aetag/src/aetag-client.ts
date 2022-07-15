import { AlApiClient, AlDefaultClient } from '@al/core';
import { AEtagset, AEtagsetList } from './types';

export class AEtagClientInstance {
    private serviceName = 'aetag';

    public constructor(public client: AlApiClient = AlDefaultClient) {
    }

    /**
     * Get all tags by a list of path names
     * POST
     * https://algithub.pd.alertlogic.net/pages/alertlogic/aetag/api/index.html#api-Tags_Resources-GetTagById
     * @param paths {Array<string>} list with the paths
     * @returns
     */
    public async getByPaths<T>(accountId: string, paths: string[]): Promise<AEtagsetList<T>> {
        return this.client.post<any>({
            service_name: this.serviceName,
            version: 'v1',
            account_id: accountId,
            path: `/tags/paths`,
            data: paths
        });
    }

    /**
     * Get a tagset by a path
     * GET
     * https://algithub.pd.alertlogic.net/pages/alertlogic/aetag/api/index.html#api-Tags_Resources-GetTagById
     * @param path {Array<string>} list with the paths
     * @returns
     */
    public async getByPath<T>(accountId: string, path: string): Promise<AEtagset<T>> {
        return this.client.get<any>({
            service_name: this.serviceName,
            version: 'v1',
            account_id: accountId,
            path: `/tags/paths/${path}`,
        });
    }

    /**
     * create/update a tagset
     * POST
     * https://algithub.pd.alertlogic.net/pages/alertlogic/aetag/api/index.html#api-Tags_Resources-PostTags
     * @param accountId {string} account id
     * @param params {object} object with the path name and the definition
     * @param payload {T}
     * @returns
     */
    public async createOrUpdate<T>(accountId: string, params: {path: string; definition: string}, payload: T): Promise<{stored: string}> {
        return this.client.post<any>({
            service_name: this.serviceName,
            version: 'v1',
            account_id: accountId,
            path: `/tags`,
            data: payload,
            params: params
        });
    }

    /**
     * create/update a tagset
     * POST
     * https://algithub.pd.alertlogic.net/pages/alertlogic/aetag/api/index.html#api-Tags_Resources-PostTags
     * @param accountId {string} account id
     * @param params {object} object with the path name
     * @param payload {T}
     * @returns
     */
    public async delete(accountId: string, path: string ): Promise<{deleted: string}> {
        return this.client.delete<any>({
            service_name: this.serviceName,
            version: 'v1',
            account_id: accountId,
            path: `/tags/paths/${path}`
        });
    }
}
