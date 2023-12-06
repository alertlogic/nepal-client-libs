import {
    AlApiClient,
    AlDefaultClient,
    AlLocation,
} from '@al/core';
import { AlMarketplaceSignupData } from './types';

export class AlASIClientInstance {
    protected client: AlApiClient;
    protected serviceName = 'asi';
    protected serviceVersion = 'v1';

    constructor(client?: AlApiClient) {
        this.client = client || AlDefaultClient;
    }

    signupMRRProduct(productType: string, fields: AlMarketplaceSignupData): Promise<void> {
        return this.client.post({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/registration/signup/mrr/${productType}`,
            data: fields
        });
    }

    activateAccount(token: string): Promise<void> {
        return this.client.post({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/registration/signup/activate/${token}`,
            data: null
        });
    }
}
