import {
    AlApiClient,
    AlDefaultClient,
    AlLocation
} from '@al/core';

import {
    AlAssetsManagerReportSummary,
    AlAssetsManagerReportSummaryQueryParams,
    AlAssetManagerNetwork,
    AlAssetsManagerSubnet
} from './types';

export class AlAssetsManagerClientInstance {
    client: AlApiClient;
    private readonly serviceName: string = 'assets_manager';
    private readonly version: string = 'v1';

    constructor(client?: AlApiClient) {
        this.client = client || AlDefaultClient;
    }

    async getReportSummary(accountId: string,
                            deploymentId: string,
                            qParams: AlAssetsManagerReportSummaryQueryParams): Promise<AlAssetsManagerReportSummary> {
        return this.client.get<AlAssetsManagerReportSummary>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.version,
            account_id: accountId,
            path: `/deployments/${deploymentId}/reports/summary`,
            params: qParams
        });
    }

    /**
     * @remarks https://console.product.dev.alertlogic.com/api/assets_manager/#api-Management-CreateNetwork
     */
    async createNetwork(accountId: string,
                        deploymentId: string,
                        data: AlAssetManagerNetwork,
                        queryParams?: {force_large_network? : boolean }): Promise<AlAssetManagerNetwork> {
        return this.client.post<AlAssetManagerNetwork>({
            data,
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.version,
            account_id: accountId,
            path: `/deployments/${deploymentId}/networks`,
            params: queryParams
        });
    }

    /**
     * @remarks https://console.product.dev.alertlogic.com/api/assets_manager/#api-Management-UpdateNetwork
     */
    async modifyNetwork(accountId: string, deploymentId: string,
            networkUuid: string, data: AlAssetManagerNetwork, queryParams?: {force_large_network? : boolean } ): Promise<AlAssetManagerNetwork> {
        return this.client.put<AlAssetManagerNetwork>({
            data,
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.version,
            account_id: accountId,
            path: `/deployments/${deploymentId}/networks/${networkUuid}`,
            params: queryParams
        });
    }

    /**
     *  @remarks https://console.product.dev.alertlogic.com/api/assets_manager/#api-Management-DeleteNetwork
     */
    async deleteNetwork(accountId: string, deploymentId: string, networkUuid: string): Promise<void> {
        return this.client.delete({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.version,
            account_id: accountId,
            path: `/deployments/${deploymentId}/networks/${networkUuid}`
        });
    }

    /**
     * @remarks https://console.product.dev.alertlogic.com/api/assets_manager/#api-Management-CreateSubnet
     */
    async createSubnet(accountId: string, deploymentId: string, networkUuid: string,
                      data: AlAssetsManagerSubnet): Promise<AlAssetsManagerSubnet> {
        return this.client.post<AlAssetsManagerSubnet>({
            data,
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.version,
            account_id: accountId,
            path: `/deployments/${deploymentId}/networks/${networkUuid}/subnets`,
        });
    }

    /**
     * @remarks https://console.product.dev.alertlogic.com/api/assets_manager/#api-Management-UpdateSubnet
     */
    async modifySubnet(accountId: string, deploymentId: string,
                      networkUuid: string, subnetUuid: string,
                      data: AlAssetsManagerSubnet): Promise<AlAssetsManagerSubnet> {
        return this.client.put<AlAssetsManagerSubnet>({
            data,
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.version,
            account_id: accountId,
            path: `/deployments/${deploymentId}/networks/${networkUuid}/subnets/${subnetUuid}`
        });
    }

    /**
     * @remarks https://console.product.dev.alertlogic.com/api/assets_manager/#api-Management-DeleteSubnet
     */
    async deleteSubnet(accountId: string, deploymentId: string,
                      networkUuid: string, subnetUuid: string): Promise<void> {
        return this.client.delete({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.version,
            account_id: accountId,
            path: `/deployments/${deploymentId}/networks/${networkUuid}/subnets/${subnetUuid}`
        });
    }
}


