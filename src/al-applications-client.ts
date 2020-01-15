/**
 * Applications API client
 */
import { AlApiClient, AlDefaultClient, AIMSAccount } from '@al/client';

export class AlApplicationsClientInstance {

    protected client:AlApiClient;
    protected serviceName = 'applications';
    protected serviceVersion = 'v1';

    constructor(client:AlApiClient = null) {
        this.client = client || AlDefaultClient;
    }
}
