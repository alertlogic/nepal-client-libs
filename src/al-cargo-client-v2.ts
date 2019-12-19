/**
 * Cargo V2 Public API endpoints Implementation
 */
import { ALClient, AlApiClient } from '@al/client';
import { AlCargoClientInstance } from './al-cargo-client';
import {
    ReportSchedule,
    ReportSchedules
} from './types';

export class AlCargoClientInstanceV2 extends AlCargoClientInstance {
    protected serviceVersion = 'v2';

    constructor( public client:AlApiClient = ALClient ) {
        super(client);
    }

    /**
     * Create schedule for given account_id.
     * POST
     * /cargo/v2/:account_id/schedule
     * "https://api.cloudinsight.alertlogic.com/cargo/v2/13334567/schedule"
     *
     * @param accountId The AIMS Account ID
     * @param schedule The schedule object
     * @returns a promise with the schedule ID
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/cargo/index.html#api-Schedules-CreateSchedule
     */
    async createSchedule( accountId: string, schedule:ReportSchedule) : Promise<string> {
        const result = await this.client.post({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/schedule`,
            data: schedule
        });

        return result.id as string;
    }

    /**
     * Get schedule for given account_id and schedule_id.
     * GET
     * /cargo/v2/:account_id/schedule/:schedule_id
     * "https://api.cloudinsight.alertlogic.com/cargo/v2/13334567/schedule/27C13BFD-3953-1005-BD8A-0EB9B569AE5D"
     *
     *  @param  accountId AIMS Account ID
     *  @param  scheduleId  Schedule ID
     *  @returns a promise with the schedule data
     *  @remarks
     *  https://console.account.product.dev.alertlogic.com/users/api/cargo/index.html#api-Schedules-GetSchedule
     */
    async getSchedule(accountId: string, scheduleId: string): Promise<ReportSchedule> {
        const result = await this.client.get({
        service_name: this.serviceName,
        version: this.serviceVersion,
        account_id: accountId,
        path: `/schedule/${scheduleId}`,
        });
        return result as ReportSchedule;
    }

    /**
     * Get list of schedules for given account_id.
     * GET
     * /cargo/v2/:account_id/schedule
     * "https://api.cloudinsight.alertlogic.com/cargo/v2/13334567/schedule"
     *
     *  @param  accountId AIMS Account ID
     *  @returns a promise with the schedule data
     *  @remarks
     *  https://console.account.product.dev.alertlogic.com/users/api/index.html#api-Schedules-ListSchedules
     */
    async getAllSchedules(accountId: string): Promise<ReportSchedules> {
        const result = await this.client.get({
        service_name: this.serviceName,
        version: this.serviceVersion,
        account_id: accountId,
        path: `/schedule`,
        });
        return result as ReportSchedules;
    }

    /**
     * Remove schedule for given account_id and schedule_id.
     * DELETE
     * /cargo/v2/:account_id/schedule/:schedule_id
     * "https://api.global-integration.product.dev.alertlogic.com/cargo/v2/13334567/schedule/27C13BFD-3953-1005-BD8A-0EB9B569AE5D"
     *
     *  @param  accountId AIMS Account ID
     *  @param  scheduleId  Schedule ID
     * @returns just the status code
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/index.html#api-Schedules-RemoveSchedule
     */
    async deleteSchedule( accountId: string, scheduleId: string) {
        const scheduleDelete = await this.client.delete({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/schedule/${scheduleId}`
        });
        return scheduleDelete;
    }

    /**
     * Create schedule for given account_id.
     * POST
     * /cargo/v2/:account_id/schedule/:schedule_id
     * "https://api.cloudinsight.alertlogic.com/cargo/v2/13334567/schedule/27C13BFD-3953-1005-BD8A-0EB9B569AE5D"
     *
     * @param accountId The AIMS Account ID
     * @param schedule The schedule object
     * @returns a promise with the schedule ID
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/cargo/index.html#api-Schedules-UpdateSchedule
     */
    async updateSchedule( accountId: string, schedule:ReportSchedule) {
        const result = await this.client.post({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/schedule/${schedule.id}`,
            data: schedule
        });

        return result;
    }

    /***** Execution Records */

    /**
     * Cancel record execution for given account_id and execution_record_id.
     * POST
     * /cargo/v2/:account_id/execution_record/:execution_record_id/cancel
     * "https://api.cloudinsight.alertlogic.com/cargo/v2/13334567/execution_record/20160801-213000-FB3D65D4-3905-1005-894D-0EA0987B68E5/cancel"
     *
     * @param accountId The AIMS Account ID
     * @param executionRecordId The Execution Record ID
     * @returns a promise with the result
     *
     * @remarks
     * https://console.account.product.dev.alertlogic.com/users/api/cargo/index.html#api-Execution_Records-CancelExecutionRecord
     * @overrides cancelScheduledReport V1
     */
    async cancelScheduledReport( accountId: string, executionRecordId:string) {
        const result = await this.client.post({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/execution_record/${executionRecordId}/cancel`
        });

        return result;
    }

    /**
     * Get number of successfully completed executions for given account_id.
     * GET
     * /cargo/v2/:account_id/execution_record/count
     * "https://api.cloudinsight.alertlogic.com/cargo/v2/13334567/execution_record/count?schedule_id=27C13BFD-3953-1005-BD8A-0EB9B569AE5D"
     *
     *  @param accountId The AIMS Account ID
     *  @param scheduleId The Schedule ID
     *  @returns a promise with the number of executions
     *  @remarks
     *  https://console.account.product.dev.alertlogic.com/users/api/cargo/index.html#api-Execution_Records-CountExecutionRecords
     */
    async countExecutionRecords(accountId: string, scheduleId: string): Promise<number> {
        const result = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/execution_record/count`,
            params: {schedule_id: scheduleId}
        });

        return result.execution_record_count as number;
    }

}
