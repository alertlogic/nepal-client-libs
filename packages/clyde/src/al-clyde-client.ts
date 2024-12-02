/**
 * Al Clyde API client
 */
import {
    AlDefaultClient, AlLocation
} from '@al/core';
import {
    MinVersionPayload,
    MinVersionQueryParams,
    GetMinVersionResponse,
    SetMinVersionResponse,
} from './types';

export class AlClydeClientInstance {

    private readonly serviceStack = AlLocation.YARDAPI;
    private version = 'v1';

    /**
     * Check the minimum version using an specific accountId
     * GET
     * @param accountId AIMS Account ID
     * @param queryParams: {min_version=2.25.0, collection_method=agent}
     * @returns a promise with the response of the minimum version for a specific accountId
     *
     */
    async checkMinVersion(accountId: string, queryParams?: MinVersionQueryParams): Promise<GetMinVersionResponse> {
        return AlDefaultClient.get({
            service_stack: this.serviceStack,
            version: '',
            path: `clyde/${this.version}/${accountId}/check_min_version`,
            params: {
                queryParams
            }
        });
    }

    /**
     * Get hosts info 
     * clyde/v1/2/get_hosts
     */
    async getHostInfo(accountId: string, queryParams?: any): Promise<unknown> {
        return AlDefaultClient.get({
            service_stack: this.serviceStack,
            version: '',
            path: `clyde/${this.version}/${accountId}/get_hosts`,
            params: queryParams
        });
    }

    // clyde/v1/{accountId}/set_min_version
    async setMinVersion(accountId: string, payload?: MinVersionPayload): Promise<SetMinVersionResponse> {
        return AlDefaultClient.post({
            service_stack: this.serviceStack,
            version: '',
            path: `clyde/${this.version}/${accountId}/set_min_version`,
            data: payload
        });
    }

}
