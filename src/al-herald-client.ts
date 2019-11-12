/**
 * Herald API client
 */
import { AlResponseValidationError } from '@al/common';
import { ALClient } from '@al/client';
import { ALSubscriptionKey } from './types';

export class AlHeraldClientInstance {

    private serviceName = 'herald';
    private serviceVersion = 'v1';

    /**
     * Get all subscriptions keys
     * GET
     * /herald/v1/subscription_keys
     * "https://api.cloudinsight.alertlogic.com/herald/v1/subscription_keys"
     */
    async getAllSubscriptionKeys(): Promise<ALSubscriptionKey[]> {
        const subscriptionKeys = await ALClient.get({
            service_name: this.serviceName,
            version:      this.serviceVersion,
            path:         '/subscription_keys'
        });
        return subscriptionKeys;
    }

}
