/**
 * Module to deal with available Correlations Public API endpoints
 */
import {
  AlDefaultClient,
  AlResponseValidationError,
} from '@al/core';

export interface AlScanScheduleV2 {
    type: string;
    name: string;
    active: boolean;
    default: boolean;
}

export interface AlScanScheduleResponseV2 extends AlScanScheduleV2 {
    created?: {
        at: number,
        by: string
    } | null;
    modified?: {
        at: number,
        by: string
    } | null;
    triggered?:  {
        at: number,
        by: string
    } | null;
}

export interface AlScheduleSummaryResponseV2 {
    last_scan_time: number;
    total_assets: number;
}

export interface AlScanSchedulesResponseV2 {
    schedules: AlScanScheduleResponseV2[] | {[key: string]: AlScanScheduleResponseV2[]}[];
    stats?: Stats;
    total: number;
}

export interface Stats {
    [key: string]: {
        [key: string]: number;
    };
}

export class AlScanSchedulerClientInstanceV2 {

    private serviceName = 'scheduler';

    /**
     *  Create scan schedule
     */
    async createScanSchedule(accountId: string, deploymentId: string, schedule: AlScanScheduleV2): Promise<AlScanScheduleResponseV2> {
        const result = await AlDefaultClient.post({
            service_name: this.serviceName,
            version: 2,
            account_id:   accountId,
            path:         `/${deploymentId}/schedules`,
            data:         schedule,
        });
        if ( ! result.hasOwnProperty("id" ) ) {
            throw new AlResponseValidationError(`Service returned unexpected result; missing 'id' property.` );
        }
        return result as AlScanScheduleResponseV2;
    }

    /**
     *  Delete scan schedule
     */
    async removeScanSchedule(accountId: string, deploymentId: string, scheduleId: string) {
        const response =  await AlDefaultClient.delete({
            service_name: this.serviceName,
            version: 2,
            account_id:   accountId,
            path:         `/${deploymentId}/schedules/${scheduleId}`
        });
        return response;
    }

    /**
     *  Get scan schedule by ID
     */
    async getScanSchedule(accountId: string, deploymentId: string, scheduleId: string): Promise<AlScanScheduleResponseV2> {
        const schedule = await AlDefaultClient.get({
            service_name: this.serviceName,
            version: 2,
            account_id:   accountId,
            path:         `/${deploymentId}/schedules/${scheduleId}`,
        });
        return schedule as AlScanScheduleResponseV2;
    }

    /**
     *  Get scan schedule summary by ID
     */
    async getScanScheduleSummary(accountId: string, deploymentId: string, scheduleId: string): Promise<AlScheduleSummaryResponseV2> {
        const schedule = await AlDefaultClient.get({
            service_name: this.serviceName,
            version: 2,
            account_id:   accountId,
            path:         `/${deploymentId}/schedules/${scheduleId}/summary`,
        });
        return schedule as AlScheduleSummaryResponseV2;
    }

    /**
     *  Get list of scan schedules
     */
    async getAllScanSchedules(accountId: string, deploymentId: string, params = {}): Promise<AlScanSchedulesResponseV2> {
         const schedules = await AlDefaultClient.get({
             service_name: this.serviceName,
             version: 2,
             account_id:   accountId,
             path:         `/${deploymentId}/schedules`,
             params:       params
         });
         return schedules as AlScanSchedulesResponseV2;
    }

    /**
     *   Update schedule
     */
    async updateScanSchedule(accountId: string, deploymentId: string, scheduleId: string, schedule: AlScanScheduleV2): Promise<AlScanScheduleResponseV2> {
        const result = await AlDefaultClient.put({
            service_name: this.serviceName,
            version: 2,
            account_id:   accountId,
            path:         `/schedules/${scheduleId}`,
            data:         schedule
        });

        if (!result.hasOwnProperty("id")) {
            throw new AlResponseValidationError(`Service returned unexpected result; missing 'id' property.`);
        }
        return result as AlScanScheduleResponseV2;
    }
}
