/**
 * Herald API client
 */
import { AlApiClient, AlDefaultClient, AIMSAccount } from '@al/client';
import {
    AlHeraldAccountSubscription,
    AlHeraldIntegration,
    AlHeraldIntegrationPayload,
    AlHeraldIntegrationTypes,
    AlHeraldNotification,
    AlHeraldNotificationIncident,
    AlHeraldNotificationList,
    AlHeraldNotificationPayload,
    AlHeraldNotificationQuery,
    AlHeraldSubscriptionKey,
    AlHeraldSubscriptionsKeyByAccountRecord,
    AlHeraldSubscriptionsKeyByAccountsRecord,
    AlHeraldTemplateMap,
    AlHeraldTemplateMapPayload,
    AlHeraldTestTemplatePayload,
    AlHeraldTestWebhookResponse,
    AlHeraldTestWebhookPayload,
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
     *
     *  @returns a promise with the subscription keys
     *  @remarks
     *  https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Subscription_Keys-GetSubscriptionKey
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
     *
     * @param accountId AIMS Account ID
     * @param feature Feature name of the subscription key. examples: endpoints, search, incidents.
     * @returns a promise with the subscriptions
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Subscriptions-GetAccountSubscriptionsByFeature
     */
    async getAllAccountSubscriptionByFeature( accountId: string, feature: string): Promise<AlHeraldAccountSubscription[]> {
        const subscriptions = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/subscriptions/${feature}`,
        });
        return subscriptions.subscriptions as AlHeraldAccountSubscription[];
    }

    /**
     * Get all integration subscriptions by feature
     * GET
     * /herald/v1/integrations/:integration_id/subscriptions/:feature
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v1/integrations/E31302AE-C9B7-4A4B-BC83-85806383D3FE/subscriptions/incidents"
     *
     * @param integrationId Corresponding integration identifier.
     * @param feature Feature name of the subscription key. examples: endpoints, search, incidents.
     * @returns a promise with the subscriptions
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Subscriptions-GetIntegrationSubscriptionsAllAccountsInFeature
     */
    async getAllIntegrationSubscriptionsByFeature( integrationId :string, feature: string): Promise<AlHeraldSubscriptionsKeyByAccountRecord[]> {
        const integrations = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/integrations/${integrationId}/subscriptions/${feature}`,
        });
        return integrations.accounts as AlHeraldSubscriptionsKeyByAccountRecord[];
    }

    /**
     * Get all user subscriptions
     * GET
     * /herald/v1/users/:user_id/subscriptions
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v1/users/715A4EC0-9833-4D6E-9C03-A537E3F98D23/subscriptions"
     *
     * @param userId AIMS User ID.
     * @returns a promise with the subscriptions
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Subscriptions-GetUserSubscriptionsAllAccounts
     */
    async getAllUserSubscriptions( userId: string ): Promise<AlHeraldAccountSubscription[]> {
        const subscriptions = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/users/${userId}/subscriptions`,
        });
        return subscriptions.accounts as AlHeraldAccountSubscription[];
    }

    /**
     * Get all user subscriptions by feature
     * GET
     * /herald/v1/users/:user_id/subscriptions/:feature
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v1/users/715A4EC0-9833-4D6E-9C03-A537E3F98D23/subscriptions/incidents"
     *
     * @param userId AIMS User ID.
     * @param feature Feature name of the subscription key. examples: endpoints, search, incidents.
     * @returns a promise with the subscriptions
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Subscriptions-GetUserSubscriptionsAllAccountsInFeature
     */
    async getAllUserSubscriptionsByFeature( userId: string, feature: string ): Promise<AlHeraldAccountSubscription[]> {
        const subscriptions = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/users/${userId}/subscriptions/${feature}`,
        });
        return subscriptions.accounts as AlHeraldAccountSubscription[];
    }

    /**
     * Get integration subscriptions
     * GET
     * /herald/v1/:account_id/integrations/:integration_id/subscriptions
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v1/12345678/integrations/E31302AE-C9B7-4A4B-BC83-85806383D3FE/subscriptions"
     *
     * @param accountId AIMS Account ID
     * @param integrationId Corresponding integration identifier.
     * @return a promise with the subscriptions
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Subscriptions-GetIntegrationSubscriptionsInAccount
     */
    async getIntegrationSubscriptions( accountId: string, integrationId: string ): Promise<AlHeraldSubscriptionsKeyByAccountRecord> {
        const subscriptions = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/integrations/${integrationId}/subscriptions`,
        });
        return subscriptions as AlHeraldSubscriptionsKeyByAccountRecord;
    }

    /**
     * Get integration subscriptions by feature
     * GET
     * /herald/v1/:account_id/integrations/:integration_id/subscriptions/:feature
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v1/12345678/integrations/E31302AE-C9B7-4A4B-BC83-85806383D3FE/subscriptions/incidents"
     *
     * @param accountId AIMS Account ID
     * @param integrationId Corresponding integration identifier.
     * @param feature Feature name of the subscription key. examples: endpoints, search, incidents
     * @return a promise with the subscriptions
     */
    async getIntegrationSubscriptionsByFeature( accountId: string, integrationId: string, feature: string ): Promise<AlHeraldSubscriptionsKeyByAccountRecord> {
        const subscriptions = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/integrations/${integrationId}/subscriptions/${feature}`,
        });
        return subscriptions as AlHeraldSubscriptionsKeyByAccountRecord;
    }

    /**
     * Get user subscriptions
     * GET
     * /herald/v1/:account_id/users/:user_id/subscriptions
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v1/12345678/users/715A4EC0-9833-4D6E-9C03-A537E3F98D23/subscriptions"
     * @param accountId AIMS Account ID
     * @param userId AIMS User ID.
     * @return a promise with the subscriptions
     */
    async getUserSubscriptions( accountId: string, userId: string ): Promise<AlHeraldSubscriptionsKeyByAccountRecord> {
        const subscriptions = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/users/${userId}/subscriptions`,
        });
        return subscriptions as AlHeraldSubscriptionsKeyByAccountRecord;
    }

    /**
     * Get user subscriptions by feature
     * GET
     * /herald/v1/:account_id/users/:user_id/subscriptions/:feature
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v1/12345678/users/715A4EC0-9833-4D6E-9C03-A537E3F98D23/subscriptions/incidents"
     * @param accountId AIMS Account ID
     * @param userId AIMS User ID.
     * @param feature Feature name of the subscription key. examples: endpoints, search, incidents
     *
     * @return a promise with the subscriptions
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Subscriptions-GetUserSubscriptionsInAccountFeature
     */
    async getUserSubscriptionsByFeature( accountId: string, userId: string, feature: string ): Promise<AlHeraldSubscriptionsKeyByAccountRecord> {
        const subscriptions = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/users/${userId}/subscriptions/${feature}`,
        });
        return subscriptions as AlHeraldSubscriptionsKeyByAccountRecord;
    }

    /**
     * Sets user's subscriptions in a given account and feature.
     * PUT
     * /herald/v1/:account_id/users/:user_id/subscriptions/:feature
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v1/12345678/users/715A4EC0-9833-4D6E-9C03-A537E3F98D23/subscriptions/incidents"
     * @param accountId AIMS Account ID
     * @param userId AIMS User ID.
     * @param feature Feature name of the subscription key. examples: endpoints, search, incidents
     * @return a promise with the subscriptions
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Subscriptions-SetUserSubscriptionsForAccountFeature
     */
    async setUserSubscriptions( accountId: string, userId: string, feature: string, payload: AlHeraldSubscriptionsKeyByAccountsRecord): Promise<AlHeraldSubscriptionsKeyByAccountsRecord> {
        const subscriptions = await this.client.put({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/users/${userId}/subscriptions/${feature}`,
            data: payload
        });
        return subscriptions as AlHeraldSubscriptionsKeyByAccountsRecord;
    }

    /**
     * Unsets user's subscriptions in a given account and feature
     * DELETE
     * /herald/v1/:account_id/users/:user_id/subscriptions/:feature
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v1/12345678/users/715A4EC0-9833-4D6E-9C03-A537E3F98D23/subscriptions/incidents"
     *
     * @param accountId AIMS Account ID
     * @param userId AIMS User ID
     * @param feature Feature name of the subscription key. examples: endpoints, search, incidents
     * @returns just the status code
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Subscriptions-UnsetUserSubscriptionsForAccountFeature
     */
    async unsetUserSubscriptionsByFeature(accountId: string, userId: string, feature: string) {
        const userSubscriptionDelete = await this.client.delete({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/users/${userId}/subscriptions/${feature}`
        });
        return userSubscriptionDelete;
    }

    /**
     * Unsets user's subscriptions in a given account and feature
     * DELETE
     * /herald/v1/:account_id/integrations/:integration_id/subscriptions/:feature
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v1/12345678/integrations/E31302AE-C9B7-4A4B-BC83-85806383D3FE/subscriptions/incidents
Header"
     *
     * @param accountId AIMS Account ID
     * @param integrationId The integration ID
     * @param feature Feature name of the subscription key. examples: endpoints, search, incidents
     * @returns just the status code
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Subscriptions-UnsetIntegrationsSubscriptionsForAccountFeature
     */
    async unsetIntegrationsSubscriptionsByFeature(accountId: string, integrationId: string, feature: string) {
        const integrationsSubscriptionDelete = await this.client.delete({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/integrations/${integrationId}/subscriptions/${feature}`
        });
        return integrationsSubscriptionDelete;
    }

    /**
     * Updates integrations's subscription in a given account, feature and subkey
     * PUT
     * /herald/v1/:account_id/integrations/:integration_id/subscriptions/:feature/:subkey
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v1/12345678/integrations/E31302AE-C9B7-4A4B-BC83-85806383D3FE/subscriptions/incidents/escalations/primary"
     *
     * @param accountId AIMS Account ID
     * @param integrationId Corresponding integration identifier.
     * @param feature Feature name of the subscription key. examples: endpoints, search, incidents
     * @param subscribed Boolean value
     * @returns a promise with the subscriptions
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Subscriptions-SetIntegrationsSubscriptionsForAccountFeatureSubkey
     */
    async updateIntegrationSubscription( accountId: string, integrationId: string, feature: string, subkey: string, subscribed: boolean) : Promise<AlHeraldSubscriptionsKeyByAccountRecord> {
        const subscriptions = await this.client.put({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/integrations/${integrationId}/subscriptions/${feature}/${subkey}`,
            data: { "subscribed": subscribed }
        });

        return subscriptions as AlHeraldSubscriptionsKeyByAccountRecord;
    }

    /**
     * Updates integrations's subscription in a given account, feature and subkey
     * POST
     * /herald/v1/integrations/:integration_id/subscriptions/:feature
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v1/integrations/E31302AE-C9B7-4A4B-BC83-85806383D3FE/subscriptions/incidents"
     *
     * @param integrationId Corresponding integration identifier.
     * @param feature Feature name of the subscription key. examples: endpoints, search, incidents
     * @param subscribed Boolean value
     * @returns a promise with the subscriptions
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Subscriptions-UpdateIntegrationsSubscriptionsForAccountsList
     */
    async updateIntegrationSubscriptionForAccountsList( integrationId: string, feature: string, accounts: AlHeraldSubscriptionsKeyByAccountRecord[]) : Promise<AlHeraldSubscriptionsKeyByAccountRecord[]> {
        const subscriptions = await this.client.post({
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/integrations/${integrationId}/subscriptions/${feature}`,
            data: { "accounts": accounts }
        });

        return subscriptions.accounts as AlHeraldSubscriptionsKeyByAccountRecord[];
    }

    /**
     * Updates user's subscription in a given account, feature and subkey
     * PUT
     * /herald/v1/:account_id/users/:user_id/subscriptions/:feature/:subkey
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v1/12345678/users/715A4EC0-9833-4D6E-9C03-A537E3F98D23/subscriptions/incidents/escalations/primary"
     *
     * @param accountId AIMS Account ID
     * @param userId AIMS User ID
     * @param feature Feature name of the subscription key. examples: endpoints, search, incidents
     * @param subkey Subscription subkey
     * @param subscribed Boolean value
     * @returns a promise with the subscriptions
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Subscriptions-SetUserSubscriptionsForAccountFeatureSubkey
     */
    async updateUserSubscription( accountId: string, userId: string, feature: string, subkey: string, subscribed: boolean) : Promise<AlHeraldSubscriptionsKeyByAccountRecord> {
        const subscriptions = await this.client.put({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/users/${userId}/subscriptions/${feature}/${subkey}`,
            data: { "subscribed": subscribed }
        });

        return subscriptions as AlHeraldSubscriptionsKeyByAccountRecord;
    }

    /**
     * Updates user's subscriptions for feature and accounts list
     * POST
     * /herald/v1/users/:user_id/subscriptions/:feature
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v1/users/715A4EC0-9833-4D6E-9C03-A537E3F98D23/subscriptions/incidents"
     *
     * @param userId AIMS User ID
     * @param feature Feature name of the subscription key. examples: endpoints, search, incidents
     * @returns a promise with the subscriptions
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Subscriptions-UpdateUserSubscriptionsForAccountsList
     */
    async updateUserSubscriptionForAccountsList( userId: string, feature: string, accounts: AlHeraldSubscriptionsKeyByAccountRecord[]) : Promise<AlHeraldSubscriptionsKeyByAccountRecord[]> {
        const subscriptions = await this.client.post({
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/users/${userId}/subscriptions/${feature}`,
            data: { "accounts": accounts }
        });

        return subscriptions.accounts as AlHeraldSubscriptionsKeyByAccountRecord[];
    }

    /**** Integrations ***/
    /**
     * Create integration for one specific account
     * POST
     * /herald/v1/:account_id/integrations/:type
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v1/12345678/integrations/webhook"
     *
     * @param accountId AIMS Account ID
     * @param type integration type, example webhooks.
     * @param payload
     * @returns promise with an integration structure
     *
     * @remarks https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Integrations-CreateAccountIntegration
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
     *
     * @param accountId AIMS Account ID
     * @param integrationId Corresponding integration identifier.
     * @returns just the status code
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Integrations-DeleteAccountIntegrations
     */
    async deleteIntegration( accountId: string, integrationId: string) {
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
     *
     * @param accountId AIMS Account ID
     * @param integrationId Corresponding integration identifier.
     * @returns a promise with the integrations
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Integrations-GetAccountIntegrations
     */
    async getIntegrationById( accountId: string, integrationId: string): Promise<AlHeraldIntegration> {
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
     *
     * @param accountId AIMS Account ID
     * @returns a promise with the integrations
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Integrations-ListAccountIntegrations
     */
    async getIntegrationsByAccount( accountId: string ): Promise<AlHeraldIntegration[]> {
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
     * @returns a promise with the integration types
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Integrations-GetIntegrationTypes
     */
    async getIntegrationTypes(): Promise<AlHeraldIntegrationTypes[]> {
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
     *
     * @param accountId AIMS Account ID
     * @param integrationId Corresponding integration identifier.
     * @param payload
     * @returns a promise with the integration
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Integrations-UpdateAccountIntegration
     */
    async updateIntegration( accountId: string, integrationId: string, payload: AlHeraldIntegrationPayload) : Promise<AlHeraldIntegration> {
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
     *
     * @param notificationId Notification id
     * @returns a promise with the notifications
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Notifications-GetANotification
     */
    async getNotificationsById( notificationId: string ): Promise<AlHeraldNotification>{
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
     *
     * @param accountId AIMS Account ID
     * @param queryParams
     * @return a promise with the notifications
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Notifications-GetANotificationByAccountId
     */
    async getNotificationsByAccountId( accountId: string, queryParams: AlHeraldNotificationQuery ): Promise<AlHeraldNotificationList> {
        const notification = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: '/notifications',
            params: queryParams
        });
        return notification as AlHeraldNotificationList;
    }

    /**
     * Get the notifications by id and by account id
     * GET
     * /herald/v1/:account_id/notifications/id/:notification_id
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v1/12345678/notifications/id/3B8EAFAABCASDD"
     *
     * @param accountId AIMS Account ID
     * @param notificationId Notification id
     * @return a promise with the notifications
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Notifications-GetANotificationByAccountIdAndNotificationId
     */
    async getNotificationsByIdAndByAccountId( accountId: string, notificationId: string ): Promise<AlHeraldNotification> {
        const notification = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/notifications/id/${notificationId}`
        });
        return notification as AlHeraldNotification;
    }

    /**
     * Get sent notifications by incidentId and accountId
     * GET
     * /herald/v1/:account_id/notifications/features/incidents/incidents/:long_incident_id
     * https://api.global-integration.product.dev.alertlogic.com/herald/v1/12345678/notifications/features/incidents/incidents/e81183mmmebdccf2
     *
     * @param accountId AIMS Account ID
     * @param incidentId Long incident id
     * @returns a promise with the notifications sent
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Notifications-GetSentIncidentNotificationsByAccountIdAndFeature
     */
    async getSentNotificationsByIncidentId( accountId: string, incidentId: string ): Promise<AlHeraldNotificationIncident[]> {
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
     *
     * @param accountId AIMS Account ID
     * @param feature Feature name of the subscription key. examples: endpoints, search, incidents.
     * @param queryParams
     * @returns a promise with the notifications
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Notifications-GetANotificationByAccountIdAndFeature
     */
    async getNotificationsByFeature( accountId: string, feature: string, queryParams: AlHeraldNotificationQuery ): Promise<AlHeraldNotificationList> {
        const notification = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/notifications/${feature}`,
            params: queryParams
        });

        return notification.notifications as AlHeraldNotificationList;
    }

    /**
     * Get notifications by feature
     * GET
     * /herald/v1/:account_id/notifications/:feature/:subkey
     * https://api.global-integration.product.dev.alertlogic.com/herald/v1/12345678/notifications/incidents/escalations/critical
     *
     * @param accountId AIMS Account ID
     * @param feature Feature name of the subscription key. examples: endpoints, search, incidents.
     * @param subkey A 2-part, "/" delimited string that identifies the specific class and/or type the subscription is for, e.g. "escalations/primary", an escalation to the primary contact(s)
     * @param queryParams
     * @returns a promise with the notifications
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Notifications-GetANotificationByAccountIdAndFeatureAndSubkey
     */
    async getNotificationsByFeatureBySubscription( accountId: string, feature: string, subkey: string, queryParams: AlHeraldNotificationQuery ): Promise<AlHeraldNotificationList> {
        const notification = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/notifications/${feature}/${subkey}`,
            params: queryParams
        });
        return notification.notifications as AlHeraldNotificationList;
    }

    /**
     * Send a notification
     * POST
     * /herald/v1/:account_id/notifications
     *
     * @param accountId AIMS Account ID
     * @param payload notification object
     * @returns a promise with a notification
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Notifications-SendANotification
     */
    async sendNotification( accountId: string, payload: AlHeraldNotificationPayload): Promise<AlHeraldNotification> {
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
     *
     * @param accountId AIMS Account ID
     * @param notificationId Notification id
     * @param payload object with status
     *
     * @returns a promise with the notification updated
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Notifications-UpdateANotification
     */
    async updateNotification( accountId: string, notificationId: string, payload: {status:string}) : Promise<AlHeraldNotification> {
        const notificationUpdate = await this.client.put({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/notifications/${notificationId}`,
            data: payload
        });

        return notificationUpdate as AlHeraldNotification;
    }
    /***** Subscribers */

    /**
     * Get a list of Account IDs that have a user subscribed for the specified feature and subscription key
     * GET
     * /herald/v1/subscribers/account_ids/:feature/:subkey
     *
     * @param accountId AIMS Account ID
     * @param feature Feature name of the subscription key. examples: endpoints, search, incidents.
     * @param subkey A 2-part, "/" delimited string that identifies the specific class and/or type the subscription is for, e.g. "escalations/primary", an escalation to the primary contact(s)
     * @returns a promise with the account ids
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Subscribers-GetAccountIdwithSubscribers
     */
    async getSubscriberIds( accountId: string, feature: string, subkey: string ): Promise<string[]> {
        const accounts = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/subscribers/account_ids/${feature}/${subkey}`
        });
        return accounts.account_ids as string[];
    }

    /**
     * Get a list of Account that have a user subscribed for the specified feature and subscription key
     * GET
     * /herald/v1/:account_id/subscribers/:feature/:subkey
     *
     * @param accountId AIMS Account ID
     * @param feature Feature name of the subscription key. examples: endpoints, search, incidents.
     * @param subkey A 2-part, "/" delimited string that identifies the specific class and/or type the subscription is for, e.g. "escalations/primary", an escalation to the primary contact(s)
     * @returns a promise with the account ids
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Subscribers-GetSubscribers
     */
    async getSubscribers( accountId: string, feature: string, subkey: string ): Promise<AIMSAccount[]> {
        const accounts = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/subscribers/${feature}/${subkey}`
        });
        return accounts.subscribers as AIMSAccount[];
    }

    /***** Template mappings */

    /**
     * Create a template mapping and returns newly created mapping object.
     * POST
     * /herald/v1/template_mappings
     *
     * @param payload template map
     * @returns a promise with the template
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Template_Mappings-CreateTemplateMapping
     */
    async createTemplateMapping( payload: AlHeraldTemplateMapPayload): Promise<AlHeraldTemplateMap> {
        const template = await this.client.post({
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: '/template_mappings',
            data: payload
        });
        return template as AlHeraldTemplateMap;
    }

    /**
     * Update template
     * PUT
     * /herald/v1/template_mappings/:feature/:subkey_part
     *
     * @param feature An alphanumeric string representing a product or sub-system, e.g. "incidents".
     * @param subkeyPart A string that identifies a set of subscriptions, e.g. "search" subkey part matches "search/:uniqueId" subscription.
     * @param payload object with template name
     *
     * @returns a promise with the template updated
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Template_Mappings-UpdateTemplateMapping
     */
    async updateTemplateMapping( feature: string, subkeyPart: string, payload: {template_name:string}) : Promise<AlHeraldTemplateMap> {
        const template = await this.client.put({
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/template_mappings/${feature}/${subkeyPart}`,
            data: payload
        });

        return template as AlHeraldTemplateMap;
    }

    /***** Test endpoints */
    /**
     * Test template
     * POST
     * /herald/v1/template/test
     *
     * @param payload
     * @returns a promise with the message_id
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Test_Endpoints-Template_test
     */
    async testTemplate( payload: AlHeraldTestTemplatePayload): Promise<string> {
        const response = await this.client.post({
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: '/template/test',
            data: payload
        });
        return response.message_id as string;
    }

    /**
     * Test a webhook
     * POST
     * /herald/v1/:account_id/webhook/test
     *
     * @param payload with the template name, http method and data
     * @returns a promise with the response
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Test_Endpoints-Webhook_test
     */
    async testWebhook( payload: AlHeraldTestWebhookPayload): Promise<AlHeraldTestWebhookResponse> {
        const response = await this.client.post({
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: '/webhook/test',
            data: payload
        });
        return response.response as AlHeraldTestWebhookResponse;
    }
}
