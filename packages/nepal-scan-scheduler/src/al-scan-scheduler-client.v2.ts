/**
 * Module to deal with available Correlations Public API endpoints
 */
import {
  AlDefaultClient,
  AlResponseValidationError,
} from '@al/core';

import {
    Schedule,
    ScheduleSummary
} from './types/models';

export class AlScanSchedulerClientInstanceV2 {

    private serviceName = 'scheduler';

    /**
     *  Lists scan schedules that belong to a particular deployment
     */
    async getScanSchedulesList(accountId: string, deploymentId: string, params = {}): Promise<Schedule[]> {
         const schedules = await AlDefaultClient.get({
             service_name: this.serviceName,
             version:      2,
             account_id:   accountId,
             path:         `/${deploymentId}/schedules`,
             params:       params
         });
         return schedules;
    }

    /**
     *  Create new Scan Schedule for a given deployment
     */
    async createScanSchedule(accountId: string, deploymentId: string, schedule: Schedule): Promise<Schedule> {
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
    async getScanSchedule(accountId: string, deploymentId: string, scheduleId: string): Promise<Schedule> {
        const schedule = await AlDefaultClient.get({
            service_name: this.serviceName,
            version:      2,
            account_id:   accountId,
            path:         `/${deploymentId}/schedules/${scheduleId}`,
        });
        return schedule;
    }

    /**
     *  Deletes Selected Schedule
     */
    async removeScanSchedule(accountId: string, deploymentId: string, scheduleId: string) {
        const response =  await AlDefaultClient.delete({
            service_name: this.serviceName,
            version:      2,
            account_id:   accountId,
            path:         `/${deploymentId}/schedules/${scheduleId}`
        });
        return response;
    }

    /**
     *   Updates a selected scan schedule
     */
    async updateScanSchedule(accountId: string, deploymentId: string, scheduleId: string, schedule: Schedule): Promise<Schedule> {
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
    async getScanScheduleSummary(accountId: string, deploymentId: string, scheduleId: string, params = {}): Promise<ScheduleSummary> {
        const scheduleSummary = await AlDefaultClient.get({
            service_name: this.serviceName,
            version:      2,
            account_id:   accountId,
            path:         `/${deploymentId}/schedules/${scheduleId}/summary`,
            params:       params
        });
        return scheduleSummary;
    }
}
