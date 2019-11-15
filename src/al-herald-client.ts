/**
 * Herald API client
 */
import { AlApiClient, AlDefaultClient } from '@al/client';
import {
    ALHeraldAccountSubscription,
    AlHeraldIntegration,
    AlHeraldIntegrationPayload,
    AlHeraldIntegrationTypes,
    AlHeraldNotification,
    AlHeraldNotificationIncident,
    AlHeraldNotificationList,
    AlHeraldNotificationPayload,
    AlHeraldNotificationQuery,
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
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v1/subscription_keys"
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

    /**** Integrations ***/
    /**
     * Create integration for one specific account
     * POST
     * /herald/v1/:account_id/integrations/:type
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v1/12345678/integrations/webhook"
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
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v1/12345678/integrations/E31302AE-C9B7-4A4B-BC83-85806383D3FE"
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
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v1/12345678/integrations/E31302AE-C9B7-4A4B-BC83-85806383D3FE"
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
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v1/12345678/integrations"
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
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v1/integration_types"
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
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v1/12345678/integrations/E31302AE-C9B7-4A4B-BC83-85806383D3FE"
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

    /**** Notifications ***/
    /**
     * Get the notifications by id
     * GET
     * /herald/v1/notifications/:notifications_id
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v1/notifications/12345678"
     */
    // Check with backend looks like is not working ok
    async getNotificationsById(notificationId: string ) {
        const notification = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/notifications/${notificationId}`
        });
        return notification as AlHeraldNotification;
    }

    /**
     * Get the notifications by account id
     * GET
     * /herald/v1/notifications/:notifications_id
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v1/12345678/notifications"
     */
    async getNotificationsByAccountId(accountId: string, queryParams: AlHeraldNotificationQuery ) {
        const notification = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: '/notifications'
        });
        return notification as AlHeraldNotificationList;
    }

    /**
     * Get the notifications by id and by account id
     * GET
     * /herald/v1/:account_id/notifications/id/:notification_id
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v1/12345678/notifications/id/3B8EAFAABCASDD"
     */
    async getNotificationsByIdAndByAccountId(accountId: string, notificationId: string ) {
        const notification = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: '/notifications'
        });
        return notification as AlHeraldNotification;
    }

    /**
     * Get sent notifications by incidentId and accountId
     * GET
     * /herald/v1/:account_id/notifications/features/incidents/incidents/:long_incident_id
     * https://api.global-integration.product.dev.alertlogic.com/herald/v1/12345678/notifications/features/incidents/incidents/e81183mmmebdccf2
     */
    async getSentNotificationsByIncidentId(accountId: string, incidentId: string ) {
        const notification = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/notifications/features/incidents/incidents/${incidentId}`
        });
        return notification.notifications as AlHeraldNotificationIncident[];
    }

    /**
     * Get notifications by feature
     * GET
     * /herald/v1/:account_id/notifications/:feature
     * https://api.global-integration.product.dev.alertlogic.com/herald/v1/12345678/notifications/incidents
     */
    async getNotificationsByFeature(accountId: string, feature: string, queryParams: AlHeraldNotificationQuery ) {
        const notification = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/notifications/${feature}`
        });
        return notification.notifications as AlHeraldNotificationList;
    }

    /**
     * Get notifications by feature
     * GET
     * /herald/v1/:account_id/notifications/:feature/:subkey
     * https://api.global-integration.product.dev.alertlogic.com/herald/v1/12345678/notifications/incidents/escalations/critical
     */
    async getNotificationsByFeatureBySubscription(accountId: string, feature: string, subkey: string, queryParams: AlHeraldNotificationQuery ) {
        const notification = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/notifications/${feature}/${subkey}`
        });
        return notification.notifications as AlHeraldNotificationList;
    }

    /**
     * Create a notification
     * POST
     * /herald/v1/:account_id/notifications
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v1/12345678/notifications"
     * -d '{
            "feature": "incidents",
            "subkey": "escalations/critical",
            "data": {
                "service_owners": "can",
                "put": "whatever",
                "they": "want",
                "in": "here",
                "it": "all",
                "goes": "to",
                "whispir": true
            },
            "attachments": [
                {
                    "name": "filename.png",
                    "description": "This is an optional description for the attachment",
                    "url": "https://example.com/info.png"
                }
            ]
        }'
     */
    async createNotification( accountId: string, payload: AlHeraldNotificationPayload): Promise<AlHeraldNotification> {
        const notification = await this.client.post({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: '/notifications',
            data: payload
        });
        return notification as AlHeraldNotification;
    }

    /**
     * Update notification by id
     * PUT
     * /herald/v1/:account_id/notifications/:notification_id
     * https://api.global-integration.product.dev.alertlogic.com/herald/v1/12345678/notifications/3B8EAFA0-1E1A-4744-AB53-0EE45EA8B102
     * -d '{
            "status": "published"
        }'
     */
    async updateNotification(accountId: string, notificationId: string, payload: {status:string}) : Promise<AlHeraldNotification> {
        const notificationUpdate = await this.client.put({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/notifications/${notificationId}`,
            data: payload
        });

        return notificationUpdate as AlHeraldNotification;
    }
}
