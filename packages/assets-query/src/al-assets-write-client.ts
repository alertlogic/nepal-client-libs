import {
    AlApiClient,
    AlDefaultClient,
    AlLocation
  } from '@al/core';

import {
    AssetWriteDeclareAssetRequestBody,
    AssetWriteDeclareAssetResponse,
    AssetWriteDeletePropertiesRequestBody,
    AssetWriteDeletePropertiesResponse,
    AssetWriteNetworkRequestBody
} from './types';

export class AlAssetsWriteClientInstance {

    private readonly serviceName: string = 'assets_write';
    private readonly serviceVersion: string = 'v1';


    /* istanbul ignore next */
    constructor(public client: AlApiClient = AlDefaultClient) {
    }

    /**
     * @remarks https://console.cloudinsight.alertlogic.com/api/assets_write/#api-Declare-CreateNetwork
     */
    async createNetwork(accountId: string,
                        deploymentId: string,
                        data: AssetWriteNetworkRequestBody): Promise<{key: string}> {
        return this.client.put({
            data,
            service_stack: AlLocation.InsightAPI,
            version: this.serviceVersion,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/deployments/${deploymentId}/assets`,
        });
    }

    /**
     * @remarks https://console.cloudinsight.alertlogic.com/api/assets_write/#api-DeclareModify-DeclareAsset
     */
    async declareAsset(accountId: string,
                       deploymentId: string,
                       data: AssetWriteDeclareAssetRequestBody): Promise<AssetWriteDeclareAssetResponse> {
        return this.client.put({
            data,
            service_stack: AlLocation.InsightAPI,
            version: this.serviceVersion,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/deployments/${deploymentId}/assets`,
        });
    }

      /**
     * @remarks https://console.cloudinsight.alertlogic.com/api/assets_write/#api-DeclareModify-RemoveProperties
     */
    async removeProperties(accountId: string,
                           deploymentId: string,
                           data: AssetWriteDeletePropertiesRequestBody): Promise<AssetWriteDeletePropertiesResponse> {
        return this.client.put({
            data,
            service_stack: AlLocation.InsightAPI,
            version: this.serviceVersion,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/deployments/${deploymentId}/assets`,
        });
    }

}
