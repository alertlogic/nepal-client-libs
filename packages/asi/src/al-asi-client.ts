import {
    AlApiClient,
    AlDefaultClient,
    AlLocation,
} from '@al/core';
import { Signup, SignupAWS } from './types';

export class AlASIClientInstance {
    protected client: AlApiClient;
    protected serviceName = 'asi';

    constructor(client?: AlApiClient) {
        this.client = client || AlDefaultClient;
    }

    signupMRRProduct(productType: string, fields: Signup): Promise<any> {
        return this.client.post({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: 'v1',
            path: `/registration/signup/mrr/${productType}`,
            data: fields
        });
    }

    signup(fields: SignupAWS): Promise<any> {
        return this.client.post({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: 'v2',
            path: `/registration/signup`,
            data: fields
        });
    }

    activateAccount(token: string): Promise<any> {
        return this.client.post({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: 'v1',
            path: `/registration/signup/activate/${token}`,
            data: null
        });
    }
}
