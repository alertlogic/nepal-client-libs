import {
    AlApiClient,
    AlDefaultClient,
} from '@al/core';
import {
    AlFimConfiguration,
    AlFimConfigurationPayload
} from './types';

// Private type
export type fimPathType = 'monitored_paths' | 'excluded_paths';

export class AlFimClientInstance {
    protected client: AlApiClient;
    protected serviceName = 'fim_config';
    protected serviceVersion = 'v1';

    constructor(client?: AlApiClient) {
        this.client = client || AlDefaultClient;
    }
    /**
    * Lists all fim excluded or monitored path configuration objects
    *  @remarks
    *  https://console.account.product.dev.alertlogic.com/users/api/fim_config/index.html#api-MonitoredPaths-ListConfigurations
    *  @remarks
    *  https://console.account.product.dev.alertlogic.com/users/api/fim_config/index.html#api-ExcludedPaths-ListConfigurations
    */
    async getAllConfigurations(pathType: fimPathType,
                               accountId: string,
                               deploymentId: string): Promise<AlFimConfiguration[]> {
        return (await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/deployments/${deploymentId}/${pathType}`,
        }) as AlFimConfiguration[]);
    }

    /**
    *  Gets a single fim excluded or monitored path configuration object
    *  @remarks
    *  https://console.account.product.dev.alertlogic.com/users/api/fim_config/index.html#api-MonitoredPaths-GetConfiguration
    *  @remarks
    *  https://console.account.product.dev.alertlogic.com/users/api/fim_config/index.html#api-ExcludedPaths-GetConfiguration
    */
    async getConfiguration(pathType: fimPathType,
                           accountId: string,
                           deploymentId: string,
                           configurationId: string): Promise<AlFimConfiguration> {
        return (await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/deployments/${deploymentId}/${pathType}/${configurationId}`,
        }) as AlFimConfiguration);
    }

    /**
    *  creates a fim excluded or monitored path configuration object
    *  @remarks
    *  https://console.account.product.dev.alertlogic.com/users/api/fim_config/index.html#api-MonitoredPaths-CreateConfiguration
    *  @remarks
    *  https://console.account.product.dev.alertlogic.com/users/api/fim_config/index.html#api-ExcludedPaths-CreateConfiguration
    */
    async createConfiguration(pathType: fimPathType,
                              accountId: string,
                              deploymentId: string,
                              payload: AlFimConfigurationPayload): Promise<AlFimConfiguration> {
        return (await this.client.post({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/deployments/${deploymentId}/${pathType}`,
            data: payload
        }) as AlFimConfiguration);
    }

    /**
    *  updates a fim excluded or monitored path configuration object
    *  @remarks
    *  https://console.account.product.dev.alertlogic.com/users/api/fim_config/index.html#api-MonitoredPaths-UpdateConfiguration
    *  @remarks
    *  https://console.account.product.dev.alertlogic.com/users/api/fim_config/index.html#api-ExcludedPaths-CreateConfiguration
    */
    async updateConfiguration(pathType: fimPathType,
                              accountId: string,
                              deploymentId: string,
                              configurationId: string,
                              payload: AlFimConfigurationPayload): Promise<AlFimConfiguration> {
        return (await this.client.put({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/deployments/${deploymentId}/${pathType}/${configurationId}`,
            data: payload
        }) as AlFimConfiguration);
    }

     /**
    *  Deletes a fim excluded or monitored path configuration object
    *  @remarks
    *  https://console.account.product.dev.alertlogic.com/users/api/fim_config/index.html#api-MonitoredPaths-DeleteConfiguration
    *  @remarks
    *  https://console.account.product.dev.alertlogic.com/users/api/fim_config/index.html#api-ExcludedPaths-DeleteConfiguration
    */
    async deleteConfiguration(pathType: fimPathType,
                              accountId: string,
                              deploymentId: string,
                              configurationId: string): Promise<void> {
        await this.client.delete({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/deployments/${deploymentId}/${pathType}/${configurationId}`,
        });
    }

}
