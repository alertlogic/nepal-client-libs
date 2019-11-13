/**
 * Herald API client
 */
import { AlApiClient, AlDefaultClient } from '@al/client';
import { AlHeraldSubscriptionKey, AlHeraldIntegration, AlHeraldIntegrationPayload, AlHeraldIntegrationTypes } from './types';

export class AlHeraldClientInstance {

    private client:AlApiClient;
    private serviceName = 'herald';
    private serviceVersion = 'v1';

    constructor(client:AlApiClient = null ) {
        this.client = client || AlDefaultClient;
    }

    /**
     * Get all subscriptions keys
     * GET
     * /herald/v1/subscription_keys
     * "https://api.cloudinsight.alertlogic.com/herald/v1/subscription_keys"
     */
    async getAllSubscriptionKeys(): Promise<AlHeraldSubscriptionKey[]> {
        const subscriptionKeys = await this.client.get({
            service_name: this.serviceName,
            version:      this.serviceVersion,
            path:         '/subscription_keys'
        });
        return subscriptionKeys;
    }


    /**** Integrations ***/
    /**
     * Create integration for one specific account
     * POST
     * /herald/v1/:account_id/integrations/:type
     * "https://api.cloudinsight.alertlogic.com/herald/v1/12345678/integrations/webhook"
     * -d '{ "name": "My Webhook", "target_url": "https://www.example.com" }'
     * @param accountId
     * @param type
     */
    async createAccountIntegration( accountId: string, type: string, payload: AlHeraldIntegrationPayload): Promise<AlHeraldIntegration> {
        const accountIntegration = await this.client.post({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/integrations/${type}`,
            data: payload
        });
        return accountIntegration as AlHeraldIntegration;
    }

    /**
     * Delete an integration for one account
     * DELETE
     * /herald/v1/:account_id/integrations/:id
     * "https://api.cloudinsight.alertlogic.com/herald/v1/12345678/integrations/E31302AE-C9B7-4A4B-BC83-85806383D3FE"
     */
    async deleteIntegration(accountId: string, integrationId: string) {
        const accountIntegrationDelete = await this.client.delete({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/integrations/${integrationId}`
        });
        return accountIntegrationDelete;
    }

    /**
     * Get one integration for one account
     * GET
     * /herald/v1/:account_id/integrations/:id
     * "https://api.cloudinsight.alertlogic.com/herald/v1/12345678/integrations/E31302AE-C9B7-4A4B-BC83-85806383D3FE"
     */
    async getIntegrationById(accountId: string, integrationId: string): Promise<AlHeraldIntegration> {
        const accountIntegration = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/integrations/${integrationId}`
        });
        return accountIntegration as AlHeraldIntegration;
    }

    /**
     * Get the integrations for one account
     * GET
     * /herald/v1/:account_id/integrations
     * "https://api.cloudinsight.alertlogic.com/herald/v1/12345678/integrations"
     */
    async getIntegrationsByAccount(accountId: string ) {
        const accountIntegrations = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: '/integrations'
        });
        return accountIntegrations.integrations as AlHeraldIntegration[];
    }

    /**
     * Get the integration types
     * GET
     * /herald/v1/integration_types
     * "https://api.cloudinsight.alertlogic.com/herald/v1/integration_types"
     */
    async getIntegrationTypes() {
        const integrationTypes = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: '/integration_types'
        });

        return integrationTypes.integration_types as AlHeraldIntegrationTypes[];
    }

    /**
     * Update integration for the specified account
     * PUT
     * /herald/v1/:account_id/integrations/:id
     * "https://api.cloudinsight.alertlogic.com/herald/v1/12345678/integrations/E31302AE-C9B7-4A4B-BC83-85806383D3FE"
     * -d '{ "name": "My Webhook Rename", "target_url": "https://www.example.com/add/path" }'
     */
    async updateIntegration(accountId: string, integrationId: string, payload: AlHeraldIntegrationPayload) : Promise<AlHeraldIntegration> {
        const integrationUpdate = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/integrations/${integrationId}`,
            data: payload
        });

        return integrationUpdate as AlHeraldIntegration;
    }

}
