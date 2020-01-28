/**
 * Applications API client
 */
import { AlApiClient, AlDefaultClient, AIMSAccount } from '@al/client';
import { AlApplication } from './types';

export class AlApplicationsClientInstance {

    protected client:AlApiClient;
    protected serviceName = 'applications';
    protected serviceVersion = 'v1';

    constructor(client:AlApiClient = null) {
        this.client = client || AlDefaultClient;
    }

    /**
     * Return the catalog of application definitions with their default log collection configuration
     * GET
     * /applications/v1/:account_id/applications
     * "https://api.product.dev.alertlogic.com/applications/v1/01000001/applications"
     *
     *  @param accountId AIMS Account ID
     *  @returns a promise with the applications list
     *
     *  @remarks
     *  https://console.product.dev.alertlogic.com/api/applications/#api-Applications-ListApplications
     */
    async getAllApplication(accountId: string): Promise<AlApplication[]> {
        const applicationList = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: '/applications',
        });
        return applicationList as AlApplication[];
    }
}
