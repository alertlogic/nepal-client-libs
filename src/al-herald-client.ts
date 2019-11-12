/**
 * Herald API client
 */
import { AlResponseValidationError } from '@al/common';
import { ALClient } from '@al/client';


export interface ALSubscriptionKey
{
    feature:    string;
    subkey:     string;
    name:       string;
    created:    { at: string, by: string};
    modified:   { at: string, by: string};
}

export class AlHeraldClientInstance {

    private serviceName = 'herald';
    private serviceVersion = 'v1';

    /**
     *  Get all subscriptions keys
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
