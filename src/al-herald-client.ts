/**
 * Herald API client
 */
import { AlApiClient, AlDefaultClient } from '@al/client';
import { ALSubscriptionKey } from './types';

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
    async getAllSubscriptionKeys(): Promise<ALSubscriptionKey[]> {
        const subscriptionKeys = await this.client.get({
            service_name: this.serviceName,
            version:      this.serviceVersion,
            path:         '/subscription_keys'
        });
        return subscriptionKeys;
    }

}
