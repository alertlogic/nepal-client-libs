/**
 * Herald API client v2
 */
import { AlApiClient, AlDefaultClient } from '@al/client';
import { AlHeraldClientInstance } from './al-herald-client';
import {
    ALHeraldSubscriber
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

}
