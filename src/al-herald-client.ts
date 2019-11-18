/**
 * Herald API client
 */
import { AlApiClient, AlDefaultClient } from '@al/client';
import {
    ALHeraldAccountSubscription,
    AlHeraldIntegration,
    AlHeraldIntegrationPayload,
    AlHeraldIntegrationTypes,
    AlHeraldSubscriptionKey,
    ALHeraldSubscriptionsKeyByAccountRecord,
} from './types';

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
            version: this.serviceVersion,
            path: '/subscription_keys'
        });
        return subscriptionKeys as AlHeraldSubscriptionKey[];
    }

    /**
     * Get all account subscriptions by feature
     * GET
     * /herald/v1/:account_id/subscriptions/:feature
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v1/12345678/subscriptions/incidents"
     */
    async getAllAccountSubscriptionByFeature( accountId: string, feature: string): Promise<ALHeraldAccountSubscription[]> {
        const subscriptions = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/subscriptions/${feature}`,
        });
        return subscriptions.subscriptions as ALHeraldAccountSubscription[];
    }

    /**
     * Get all integration subscriptions by feature
     * GET
     * /herald/v1/integrations/:integration_id/subscriptions/:feature
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v1/integrations/E31302AE-C9B7-4A4B-BC83-85806383D3FE/subscriptions/incidents"
     */
    async getAllIntegrationSubscriptionsByFeature( integrationId :string, feature: string): Promise<ALHeraldSubscriptionsKeyByAccountRecord[]> {
        const integrations = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/integrations/${integrationId}/subscriptions/${feature}`,
        });
        return integrations.accounts as ALHeraldSubscriptionsKeyByAccountRecord[];
    }

    /**
     * Get all user subscriptions
     * GET
     * /herald/v1/users/:user_id/subscriptions
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v1/users/715A4EC0-9833-4D6E-9C03-A537E3F98D23/subscriptions"
     */
    async getAllUserSubscriptions( userId: string ): Promise<ALHeraldAccountSubscription[]> {
        const subscriptions = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/users/${userId}/subscriptions`,
        });
        return subscriptions.accounts as ALHeraldAccountSubscription[];
    }

    /**
     * Get all user subscriptions by feature
     * GET
     * /herald/v1/users/:user_id/subscriptions/:feature
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v1/users/715A4EC0-9833-4D6E-9C03-A537E3F98D23/subscriptions/incidents"
     */
    async getAllUserSubscriptionsByFeature( userId: string, feature: string ): Promise<ALHeraldAccountSubscription[]> {
        const subscriptions = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/users/${userId}/subscriptions/${feature}`,
        });
        return subscriptions.accounts as ALHeraldAccountSubscription[];
    }

    /**
     * Get integration subscriptions
     * GET
     * /herald/v1/:account_id/integrations/:integration_id/subscriptions
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v1/12345678/integrations/E31302AE-C9B7-4A4B-BC83-85806383D3FE/subscriptions"
     */
    async getIntegrationSubscriptions( accountId: string, integrationId: string ): Promise<ALHeraldSubscriptionsKeyByAccountRecord> {
        const subscriptions = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/integrations/${integrationId}/subscriptions`,
        });
        return subscriptions as ALHeraldSubscriptionsKeyByAccountRecord;
    }

    /**
     * Get integration subscriptions by feature
     * GET
     * /herald/v1/:account_id/integrations/:integration_id/subscriptions/:feature
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v1/12345678/integrations/E31302AE-C9B7-4A4B-BC83-85806383D3FE/subscriptions/incidents"
     */
    async getIntegrationSubscriptionsByFeature( accountId: string, integrationId: string, feature: string ): Promise<ALHeraldSubscriptionsKeyByAccountRecord> {
        const subscriptions = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/integrations/${integrationId}/subscriptions/${feature}`,
        });
        return subscriptions as ALHeraldSubscriptionsKeyByAccountRecord;
    }

    /**
     * Get user subscriptions
     * GET
     * /herald/v1/:account_id/users/:user_id/subscriptions
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v1/12345678/users/715A4EC0-9833-4D6E-9C03-A537E3F98D23/subscriptions"
     */
    async getUserSubscriptions( accountId: string, userId: string ): Promise<ALHeraldSubscriptionsKeyByAccountRecord> {
        const subscriptions = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/users/${userId}/subscriptions`,
        });
        return subscriptions as ALHeraldSubscriptionsKeyByAccountRecord;
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
    async createIntegration( accountId: string, type: string, payload: AlHeraldIntegrationPayload): Promise<AlHeraldIntegration> {
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
        const integrationUpdate = await this.client.put({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/integrations/${integrationId}`,
            data: payload
        });

        return integrationUpdate as AlHeraldIntegration;
    }

}
