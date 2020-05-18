/**
 * Module to deal with available Correlations Public API endpoints
 */
import {
  AlDefaultClient,
  AlResponseValidationError,
} from '@al/core';

export interface AlScheduleV2 {
    type: string;
    name: string;
    active: boolean;
    default: boolean;
}

export interface AlScheduleResponseV2 extends AlScheduleV2 {
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

export interface AlSchedulesResponseV2 {
    schedules: AlScheduleResponseV2[] | {[key: string]: AlScheduleResponseV2[]}[];
    stats?: Stats;
    total: number;
}

export interface Stats {
    [key: string]: {
        [key: string]: number;
    };
}

export class AlSchedulerClientInstanceV2 {

    private serviceName = 'scheduler';

    /**
     *  Create schedule
     */
    async createSchedule(accountId: string, schedule: AlScheduleV2): Promise<AlScheduleResponseV2> {
        const result = await AlDefaultClient.post({
            service_name: this.serviceName,
            version: 2,
            account_id:   accountId,
            path:         '/schedules',
            data:         schedule,
        });
        if ( ! result.hasOwnProperty("id" ) ) {
            throw new AlResponseValidationError(`Service returned unexpected result; missing 'id' property.` );
        }
        return result as AlScheduleResponseV2;
    }

    /**
     *  Delete schedule
     */
    async removeSchedule(accountId: string, scheduleId: string) {
        const response =  await AlDefaultClient.delete({
            service_name: this.serviceName,
            version: 2,
            account_id:   accountId,
            path:         `/schedules/${scheduleId}`
        });
        return response;
    }

    /**
     *  Get schedule by ID
     */
    async getSchedule(accountId: string, scheduleId: string): Promise<AlScheduleResponseV2> {
        const schedule = await AlDefaultClient.get({
            service_name: this.serviceName,
            version: 2,
            account_id:   accountId,
            path:         `/schedules/${scheduleId}`,
        });
        return schedule as AlScheduleResponseV2;
    }

    /**
     *  Get schedule summary by ID
     */
    async getScheduleSummary(accountId: string, scheduleId: string): Promise<AlScheduleSummaryResponseV2> {
        const schedule = await AlDefaultClient.get({
            service_name: this.serviceName,
            version: 2,
            account_id:   accountId,
            path:         `/schedules/${scheduleId}/summary`,
        });
        return schedule as AlScheduleSummaryResponseV2;
    }

    /**
     *  Get all schedules
     */
    async getAllSchedules(accountId: string, params = {}): Promise<AlSchedulesResponseV2> {
         const schedules = await AlDefaultClient.get({
             service_name: this.serviceName,
             version: 2,
             account_id:   accountId,
             path:         '/schedules',
             params:       params
         });
         return schedules as AlSchedulesResponseV2;
    }

    /**
     *   Update schedule
     */
    async updateSchedule(accountId: string, scheduleId: string, schedule: AlScheduleV2): Promise<AlScheduleResponseV2> {
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
        return result as AlScheduleResponseV2;
    }
}
