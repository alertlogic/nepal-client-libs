/**
 * Module to deal with available Correlations Public API endpoints
 */
import {
  AlDefaultClient,
  AlResponseValidationError,
} from '@al/core';

import {
    AlScanSchedule,
    AlScanScheduleSummary,
    AlScanScopeItemAsset,
    AlIPValidationResult,
    AlScanScopeItemIPRange,
    AlScanScopeItemCIDR,
    AlTimeZone
} from './types/models';

export class AlScanSchedulerClientInstanceV2 {

    private serviceName = 'scheduler';

    /**
     *  Lists scan schedules that belong to a particular deployment
     */
    async getScanSchedulesList(accountId: string, deploymentId: string, params = {}): Promise<AlScanSchedule[]> {
         return AlDefaultClient.get({
             service_name: this.serviceName,
             version:      2,
             account_id:   accountId,
             path:         `/${deploymentId}/schedules`,
             params:       params
         });
    }

    /**
     *  Create new Scan Schedule for a given deployment
     */
    async createScanSchedule(accountId: string, deploymentId: string, schedule: AlScanSchedule): Promise<AlScanSchedule> {
        const result = await AlDefaultClient.post({
            service_name: this.serviceName,
            version:      2,
            account_id:   accountId,
            path:         `/${deploymentId}/schedules`,
            data:         schedule,
        });
        if ( ! result.hasOwnProperty("id" ) ) {
            throw new AlResponseValidationError(`Service returned unexpected result; missing 'id' property.` );
        }
        return result;
    }

    /**
     *  Returns the scan schedule definition for a given id
     */
    async getScanSchedule(accountId: string, deploymentId: string, scheduleId: string): Promise<AlScanSchedule> {
        return AlDefaultClient.get({
            service_name: this.serviceName,
            version:      2,
            account_id:   accountId,
            path:         `/${deploymentId}/schedules/${scheduleId}`,
        });
    }

    /**
     *  Deletes Selected Schedule
     */
    async removeScanSchedule(accountId: string, deploymentId: string, scheduleId: string) {
        return AlDefaultClient.delete({
            service_name: this.serviceName,
            version:      2,
            account_id:   accountId,
            path:         `/${deploymentId}/schedules/${scheduleId}`
        });
    }

    /**
     *   Updates a selected scan schedule
     */
    async updateScanSchedule(accountId: string, deploymentId: string, scheduleId: string, schedule: AlScanSchedule): Promise<AlScanSchedule> {
        const result = await AlDefaultClient.put({
            service_name: this.serviceName,
            version:      2,
            account_id:   accountId,
            path:         `/${deploymentId}/schedules/${scheduleId}`,
            data:         schedule
        });

        if (!result.hasOwnProperty("id")) {
            throw new AlResponseValidationError(`Service returned unexpected result; missing 'id' property.`);
        }
        return result;
    }

    /**
     *  Get scan schedule summary by ID
     */
    async getScanScheduleSummary(accountId: string, deploymentId: string, scheduleId: string, params = {}): Promise<AlScanScheduleSummary> {
        return AlDefaultClient.get({
            service_name: this.serviceName,
            version:      2,
            account_id:   accountId,
            path:         `/${deploymentId}/schedules/${scheduleId}/summary`,
            params:       params
        });
    }

    /**
     *  Expedites scan for all the scannable targets that are descendants of a given
     *  level of the topology (for example all hosts belonging to a given subnet)
     *
     *  @force param: Allows to override the exclusion rules applied to selected targets.
     *                Otherwise exclusion rules take precedence over expedited scan.
     */
    async scanNow(accountId: string, deploymentId: string, scanScopeItem: AlScanScopeItemAsset, params: {force: boolean} = {force: false}) {
        return AlDefaultClient.put({
            service_name: this.serviceName,
            version:      2,
            account_id:   accountId,
            path:         `/${deploymentId}/scan`,
            data:         scanScopeItem,
            params: params
        });
    }

    /**
     *  Validates a list of supplied IP Addresses, checking for their correctness.
     *  This API always returns 200 OK status and provides the results of validation using two arrays with respective status (valid/invalid).
     *  IP Addresses that are present in the valid list can be subsequently used as applicable ScanScopeItems.
     */
    async validateIp(accountId: string, deploymentId: string, ips: string[]): Promise<AlIPValidationResult> {
        return AlDefaultClient.post({
            service_name: this.serviceName,
            version:      2,
            account_id:   accountId,
            path:         `/${deploymentId}/ip_validator`,
            data:         ips
        });
    }

    /**
     *  Lists supported timezones that can be used in ScanWindow definition
     */
    async getTimeZonesList(): Promise<AlTimeZone[]> {
         return AlDefaultClient.get({
             service_name: this.serviceName,
             version:      2,
             path:         `/timezones`
         });
    }
}
