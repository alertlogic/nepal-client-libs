/**
 * Integrations API client
 */
import {
    AlApiClient,
    AlDefaultClient,
    AlLocation
} from '@al/core';
import { AlIntegrationType, AlIntegrationTypeDetail, AlIntegrationConnection } from './types';

export class AlIntegrationsClientInstance {

    protected client:AlApiClient;
    protected serviceName = 'integrations';
    protected serviceVersion = 'v1';
    protected serviceStack = AlLocation.IntegrationsAPI;

    constructor(client:AlApiClient = null) {
        this.client = client || AlDefaultClient;
    }

    /**
     * Get a list of supported integration types
     * GET
     * /integrations/v1/integration_types
     * https://integrations.mdr.global.alertlogic.com
     *
     *  @returns a list of integration types
     *
     *  @remarks
     *
     * */
    async getIntegrationTypes() {
        return this.client.get<AlIntegrationType[]>({
            service_name: this.serviceName,
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            path: '/integration_types'
        });
    }

    /**
     * Get integration type details
     * GET
     * /integrations/v1/integration_types/{name}
     * https://integrations.mdr.global.alertlogic.com
     *
     *  @returns an integration type
     *
     *  @remarks
     *
     * */
    async getIntegrationTypeByName() {
        return this.client.get<AlIntegrationTypeDetail>({
            service_name: this.serviceName,
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            path: '/integration_types'
        });
    }

    /**
     * Returns Integration Connection Information
     * GET
     * /integrations/v1/{account_id}/connections/{id}
     * https://integrations.mdr.global.alertlogic.com
     *
     *  @returns an existing connection
     *
     *  @remarks
     *
     * */
    async getConnectionById(accountId:string, connectionId:string) {
        return this.client.get<AlIntegrationConnection>({
            service_name: this.serviceName,
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            account_id: accountId,
            path: `/connections/${connectionId}`
        });
    }
}
