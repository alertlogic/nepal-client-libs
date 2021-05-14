import {
    AlApiClient,
    AlDefaultClient,
    AlLocation,
} from '@al/core';
import { SignupAWS } from './types';

export class AlASIClientInstanceV2 {
    protected client: AlApiClient;
    protected serviceName = 'asi';
    protected serviceVersion = 'v2';

    constructor(client?: AlApiClient) {
        this.client = client || AlDefaultClient;
    }

    signup(fields: SignupAWS): Promise<any> {
        return this.client.post({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/registration/signup`,
            data: fields
        });
    }

}
