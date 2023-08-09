import {
    AlApiClient,
    AlDefaultClient,
    AlLocation,
} from '@al/core';
import {
    AlMarketplaceSignupData as Payload,
    AlMarketplaceSignupProduct as Product
} from './types';


export class AlASIClientInstanceV2 {
    protected client: AlApiClient;
    protected serviceName = 'asi';
    protected serviceVersion = 'v2';

    constructor(client?: AlApiClient) {
        this.client = client || AlDefaultClient;
    }

    signup(data: Payload, product?: Product): Promise<void> {
        let path = `/registration/signup`;
        if (product === 'standalone_waf') {
            path = `/registration/signup/fortra/waf`;
        }
        return this.client.post({
            path,
            data,
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
        });
    }

}
