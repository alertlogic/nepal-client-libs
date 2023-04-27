/**
 * Al WSM API client
 */
import {
    AlDefaultClient, AlLocation
} from '@al/core';
import {
    AlWSMAppliance,
    AlWSMConfigAppliance,
    StatField,
    StatsInfo,
    StatType
} from './types';

export class AlWSMClientInstance {

    private readonly serviceStack = AlLocation.YARDAPI;

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
            service_stack: this.serviceStack,
            version: '',
            path: `/api/appliance/select`,
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
    async getApplianceInfo(applianceUuid: string): Promise<AlWSMConfigAppliance> {
        return AlDefaultClient.get({
            service_stack: this.serviceStack,
            version: '',
            path: `/api/wsm/config/appliance/${applianceUuid}`
        });
    }

    /**
     * Get availability of the appliance UI
     * GET
     * /wsm/manage/appliance/${applianceUuid}/auth.html?mode=login
     *
     * @param applianceUuid Appliance UUID
     * @returns a promise with returning true if the UI is up, otherwise false
     *
     * @remarks
     */
    async getWafUiAvailability(applianceUuid: string): Promise<unknown> {
        return AlDefaultClient.get({
            service_stack: this.serviceStack,
            version: '',
            path: `/api/wsm/manage/appliance/${applianceUuid}/auth.html?mode=login`
        });
    }

    /**
     * Get Stats
     * GET
     * /wsm/stats/${type}/select
     *
     * @param type 'network'|'proxy'|'system'
     * @param accountId AIMS Account ID
     * @param applianceUuids Appliance UUID array of string
     * @param fields all allowed fields to get
     * @returns a promise with returning an array of StatsInfo object
     *
     * @remarks
     */
    async getStats(type:StatType, accountId:string, applianceUuids:string[], fields:StatField[]): Promise<StatsInfo[]> {
        return AlDefaultClient.get({
            service_stack: this.serviceStack,
            version: '',
            path: `/api/wsm/stats/${type}/select`,
            params: {
                appliance_uuids: applianceUuids.join(','),
                customer_ids: accountId,
                fields: fields.join(',')
            }
        });
    }

}
