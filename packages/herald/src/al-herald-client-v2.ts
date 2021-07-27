/**
 * Herald API client v2
 */
import {
    AlApiClient,
    AlDefaultClient,
    AlLocation,
} from '@al/core';
import { AlHeraldClientInstance } from './al-herald-client';
import {
    AlHeraldAccountSubscriptionPayloadV2,
    AlHeraldAccountSubscriptionResponseV2,
    AlHeraldAccountSubscriptionV2,
    AlHeraldNotificationType,
    AlHeraldNotificationV2,
    ALHeraldSubscriber,
    AlHeraldSubscribersV2,
    AlHeraldSubscriptionsQueryV2,
    AlHeraldUpdateSubscriptionPayloadV2,
    AlHeraldTestWebhookPayload,
    AlHeraldTestWebhookResponse,
    AlHeraldTestEmailPayload,
    AlHeraldTestJiraPayload,
} from './types/index';

export class AlHeraldClientInstanceV2 extends AlHeraldClientInstance {

    protected serviceVersion = 'v2';

    super(client: AlApiClient = null): void {
        this.client = client || AlDefaultClient;
    }

    /***** Subscribers V2 *****/

    /**
     * Subscribe subscriber to existing subscription
     * POST
     * /herald/v2/:account_id/subscriptions/:subscription_id/subscribers
     *
     * @param accountId The AIMS Account ID
     * @param subscriptionId The subscription ID
     * @param subscriber The subscriber data
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Subscribers_v2-AddSubscriber
     */
    async addSubscriberToSubscription(accountId: string, subscriptionId: string, subscriber: ALHeraldSubscriber): Promise<ALHeraldSubscriber> {
        return this.client.post<ALHeraldSubscriber>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/subscriptions/${subscriptionId}/subscribers`,
            data: subscriber
        });
    }

    /**
     * List all subscribers subscribed to that subscription
     * GET
     * /herald/v2/:account_id/subscriptions/:subscription_id/subscribers
     *
     * @param accountId The AIMS Account ID
     * @param subscriptionId The subscription ID
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Subscribers_v2-ListSubscribers
     */
    async listAllSubscribers(accountId: string, subscriptionId: string): Promise<ALHeraldSubscriber[]> {
        const result = await this.client.get({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/subscriptions/${subscriptionId}/subscribers`
        });
        return result.subscribers as ALHeraldSubscriber[];
    }

    /**
     * Unsubscribe subscriber from subscription
     * DELETE
     * /herald/v2/:account_id/subscriptions/:subscription_id/subscribers/:subscriber_type/:subscriber
     *
     * @param accountId The AIMS Account ID
     * @param subscriptionId The Subscription ID
     * @param subscriberType The Subscription type
     * @returns just the status code
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Subscribers_v2-RemoveSubscriber
     */
    async unsubscribeFromSubscriptionType(accountId: string, subscriptionId: string, subscriberType: string): Promise<void> {
        const result = await this.client.delete({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/subscriptions/${subscriptionId}/subscribers/${subscriberType}/:subscriber`
        });
        return result;
    }

    /***** NotificationTypes V2 *****/

    /**
     * Create a notification type
     * POST
     * /herald/v2/notification_types
     *
     * @param notificationTypePayload Notification type payload
     * @returns a promise with the new notification type
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-NotificationTypes-CreateNotificationType
     */
    async createNotificationType(notificationTypePayload: AlHeraldNotificationType): Promise<AlHeraldNotificationType> {
        return this.client.post<AlHeraldNotificationType>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: '/notification_types',
            data: notificationTypePayload
        });
    }

    /**
     * Delete a notification type
     * DELETE
     * /herald/v2/notification_types/:notification_type
     *
     * @param notificationType Notification type
     * @returns just the status code
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-NotificationTypes-DeleteNotificationType
     */
    async deleteNotificationType(notificationType: string): Promise<void> {
        const result = await this.client.delete({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/notification_types/${notificationType}`
        });
        return result;
    }

    /**
     * List all notification types
     * GET
     * /herald/v2/notification_types
     *
     * @return a promise with all notification types
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-NotificationTypes-GetNotificationType
     */
    async getAllNotificationTypes(): Promise<AlHeraldNotificationType[]> {
        const result = await this.client.get({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: '/notification_types'
        });
        return result.notification_types as AlHeraldNotificationType[];
    }

    /**
     * Update a notification type
     * PUT
     * /herald/v2/notification_types/:notification_type
     *
     * @param notificationType The notification type as string
     * @param payload Notification type object
     * @returns a promise with the notification type that was updated
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-NotificationTypes-UpdateNotificationType
     */
    async updateNotificationType(notificationType: string, payload: AlHeraldNotificationType): Promise<AlHeraldNotificationType> {
        return this.client.put<AlHeraldNotificationType>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/notification_types/${notificationType}`,
            data: payload
        });
    }

    /***** Notifications V2 *****/

    /**
     * Get a notification by account id and notification id
     * GET
     * /herald/v2/:account_id/notifications/:notification_id
     *
     * @param accountId AIMS Account ID
     * @param notification_id Notification id
     * @returns a promise with the notification
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Notifications-GetANotificationByAccountIdAndNotificationId
     */
    async getNotificationByAccountIdAndNotificationId(accountId: string, notificationId: string): Promise<AlHeraldNotificationV2> {
        return this.client.get<AlHeraldNotificationV2>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/notifications/${notificationId}`
        });
    }

    /**
     * Get a notification
     * GET
     * /herald/v2/notifications/:notification_id
     *
     * @param notificationId AIMS Account ID
     * @returns a promise with a notification
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Notifications-GetANotification
     */
    async getNotification(notificationId: string): Promise<AlHeraldNotificationV2> {
        return this.client.get<AlHeraldNotificationV2>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/notifications/${notificationId}`
        });
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
    async sendNotificationV2(accountId: string, payload: AlHeraldNotificationV2): Promise<AlHeraldNotificationV2> {
        return this.client.post<AlHeraldNotificationV2>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: '/notifications',
            data: payload
        });
    }

    /***** Subscriptions V2 *****/
    /**
     * Create a subscription for an account
     * POST
     * /herald/v2/:account_id/subscriptions
     * @param accountId The AIMS Account ID
     * @param subscription payload
     * @returns a promise with the new subscription
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Subscriptions_v2-CreateSubscription
     */
    async createSubscription(accountId: string, subscription: AlHeraldAccountSubscriptionPayloadV2): Promise<AlHeraldAccountSubscriptionResponseV2> {
        return this.client.post<AlHeraldAccountSubscriptionResponseV2>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: '/subscriptions',
            data: subscription
        });
    }

    /***** Subscriptions V2 *****/
    /**
     * Update a subscription for an account
     * POST
     * /herald/v2/:account_id/subscriptions/:subscription_id
     * @param accountId The AIMS Account ID
     * @param subscriptionId id
     * @param subscription payload
     * @returns a promise with the data changed
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Subscriptions_v2-UpdateSubscription
     */
    async updateSubscription(accountId: string, subscriptionId: string, subscription: AlHeraldUpdateSubscriptionPayloadV2): Promise<AlHeraldUpdateSubscriptionPayloadV2> {
        return this.client.post<AlHeraldUpdateSubscriptionPayloadV2>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/subscriptions/${subscriptionId}`,
            data: subscription
        });
    }

    /**
     * Delete a subscription by id
     * DELETE
     * /herald/v2/:account_id/subscriptions/:subscription_id
     *
     * @param accountId The AIMS Account ID
     * @param subscription id
     * @returns just the status code
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Subscriptions_v2-DeleteSubscription
     */
    async deleteSubscriptionById(accountId: string, subscriptionId: string): Promise<void> {
        const result = await this.client.delete({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/subscriptions/${subscriptionId}`
        });
        return result;
    }

    /**
     * Get all subscriptions
     * GET
     * /herald/v2/:accountId/subscriptions
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v2/:accountId/subscriptions"
     *
     * @param accountId The AIMS Account ID
     * @returns a promise with the subscriptions
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Subscriptions_v2-ListSubscriptions
     */
    async getAllSubscriptionsByAccount(accountId: string, queryParams?: AlHeraldSubscriptionsQueryV2): Promise<AlHeraldAccountSubscriptionV2[]> {

        const subscriptionKeys = await this.client.get({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: '/subscriptions',
            params: queryParams
        });
        return subscriptionKeys.subscriptions as AlHeraldAccountSubscriptionV2[];
    }


    /**
     * Get a subscription for an account and subscription id
     * GET
     * /herald/v2/:account_id/subscriptions/:subscription_id
     * "https://api.global-integration.product.dev.alertlogic.com/herald/v2/:accountId/subscriptions"
     *
     * @param accountId The AIMS Account ID
     * @param subscriptionId The subscription Id
     * @param query params include_subscribers true or false
     * @returns a promise with the subscriptions
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Subscriptions_v2-ListSubscriptionsById
     */
    async getSubscriptionByAccountAndSubscriptionId(accountId: string, subscriptionId: string, queryParams?: { include_subscribers: boolean }): Promise<AlHeraldAccountSubscriptionV2> {

        return this.client.get<AlHeraldAccountSubscriptionV2>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/subscriptions/${subscriptionId}`,
            params: queryParams
        });
    }

    /**
     * Delete multiple subscriptions by an array of id's
     * POST
     * /herald/v2/:account_id/subscriptions/batch/delete
     *
     * @param accountId The AIMS Account ID
     * @param subscription ids
     * @returns just the status code
     *
     * @remarks
     * https://console.product.dev.alertlogic.com/api/herald/#api-Subscriptions_v2-BatchDeleteSubscription
     */
    async deleteSubscriptionsByIds(accountId: string, subscriptionIds: string[]): Promise<void> {
        const result = await this.client.post({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/subscriptions/batch/delete`,
            data: { ids: subscriptionIds }
        });
        return result;
    }

    /**
     * Allows update multiple subcriptions (delete | add)
     * POST
     * /herald/v2/:account_id/subscriptions/:subscriptionId/subscribers/batch/update
     *
     * @param accountId The AIMS Account ID
     * @param subscriptionId: string
     * @param subscriptions: AlHeraldSubscribersV2[]
     * @returns just the status code
     *
     */
    async batchUpdateSubscriptions(accountId: string, subscriptionId: string, subscriptions: AlHeraldSubscribersV2[]): Promise<void> {
        return await this.client.post({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/subscriptions/${subscriptionId}/subscribers/batch/update`,
            data: { subscribers: subscriptions }
        });
    }


    /**
    * Test a webhook
    * POST
    * /herald/v2/:account_id/webhook/test
    *
    * @param accountId The AIMS Account ID
    * @param integrationType email webhook
    * @param payload with the template name, http method and data
    * @returns a promise with the response
    *
    * @remarks
    * https://console.account.product.dev.alertlogic.com/users/api/herald/index.html#api-Test_Endpoints-Webhook_test
    */
    async testIntegration(accountId: string,
        integrationType: string,
        payload: AlHeraldTestWebhookPayload | AlHeraldTestEmailPayload | AlHeraldTestJiraPayload
    ): Promise<AlHeraldTestWebhookResponse> {
        return this.client.post<AlHeraldTestWebhookResponse>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/${integrationType}/test`,
            data: payload
        });
    }
}
