/**
 * Herald API client v2
 */
import { AlApiClient, AlDefaultClient } from '@al/client';
import { AlHeraldClientInstance } from './al-herald-client';
import {
    ALHeraldSubscriber,
    ALHeraldNotificationType
} from './types/index';

export class AlHeraldClientInstanceV2 extends AlHeraldClientInstance {

    protected serviceVersion = 'v2';

    super(client:AlApiClient = null ) {
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
    async addSubscriberToSubscription(accountId: string, subscriptionId:string, subscriber: ALHeraldSubscriber): Promise<ALHeraldSubscriber> {
        const result = await this.client.post({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/subscriptions/${subscriptionId}/subscribers`,
            data: subscriber
        });
        return result as ALHeraldSubscriber;
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
    async listAllSubscribers(accountId: string, subscriptionId:string): Promise<ALHeraldSubscriber[]> {
        const result = await this.client.get({
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
    async unsubscribeFromSubscriptionType(accountId: string, subscriptionId: string, subscriberType: string) {
        const result = await this.client.delete({
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
    async createNotificationType(notificationTypePayload: ALHeraldNotificationType): Promise<ALHeraldNotificationType> {
        const result = await this.client.post({
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: '/notification_types',
            data: notificationTypePayload
        });
        return result as ALHeraldNotificationType;
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
    async deleteNotificationType(notificationType: string) {
        const result = await this.client.delete({
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
    async getAllNotificationTypes(): Promise<ALHeraldNotificationType[]> {
        const result = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: '/notification_types'
        });
        return result.notification_types as ALHeraldNotificationType[];
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
    async updateNotificationType(notificationType: string, payload: ALHeraldNotificationType) : Promise<ALHeraldNotificationType> {
        const subscriptions = await this.client.put({
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/notification_types/${notificationType}`,
            data: payload
        });

        return subscriptions as ALHeraldNotificationType;
    }

}
