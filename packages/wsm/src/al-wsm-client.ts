/**
 * Al WSM API client
 */
import {
    AlDefaultClient
} from '@al/core';
import {
    AlWSMAppliance,
    AlWSMConfigAppliance
} from './types';


export class AlWSMClientInstance {

    private targetEndpoint = 'yard';
    private serviceName = 'api';

    /**
     * Get all appliances using an specific accountId
     * GET
     * /api/appliance/select?features=wsm_enabled&customer_ids={accountId}
     * @param accountId AIMS Account ID
     * @returns a promise with an array of appliances of a specific accountId
     *
     * @remarks
     */
    async getAppliances(accountId: string): Promise<AlWSMAppliance[]> {
        return AlDefaultClient.get({
            target_endpoint: this.targetEndpoint,
            service_name: this.serviceName,
            version: '',
            path: `/appliance/select`,
            params: {
                features: 'wsm_enabled',
                customer_ids: accountId
            }
        });
    }

    /**
     * Get an appliance's full data using an specific applianceUuid
     * GET
     * /api/wsm/config/appliance/{applianceUuid}
     *
     * @param accountId AIMS Account ID
     * @param applianceUuid Appliance UUID
     * @returns a promise with the an Appliance object with all its properties
     *
     * @remarks
     */
    async getApplianceInfo(accountId: string, applianceUuid: string): Promise<AlWSMConfigAppliance> {
        return AlDefaultClient.get({
            target_endpoint: this.targetEndpoint,
            service_name: this.serviceName,
            version: '',
            path: `/wsm/config/appliance/${applianceUuid}`
        });
    }
}
