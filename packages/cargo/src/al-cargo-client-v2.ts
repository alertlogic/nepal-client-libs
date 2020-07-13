/**
 * Cargo V2 Public API endpoints Implementation
 */
import {
    AlApiClient,
    AlDefaultClient,
    AlLocation,
} from '@al/core';
import { AlCargoClientInstance } from './al-cargo-client';
import {
    ExecutionRecordListV2,
    ExecutionRecordOnceRequestV2,
    ExecutionRecordRequestV2,
    ExecutionRecordsQueryParamsV2,
    ExecutionRecordV2,
    ScheduledReportListV2,
    ScheduledReportV2,
} from './types';

export class AlCargoClientInstanceV2 extends AlCargoClientInstance {
    protected serviceVersion = 'v2';

    constructor(public client: AlApiClient = AlDefaultClient) {
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
    async createSchedule(accountId: string, schedule: ScheduledReportV2): Promise<string> {
        const result = await this.client.post({
            service_stack: AlLocation.InsightAPI,
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
    async getSchedule(accountId: string, scheduleId: string): Promise<ScheduledReportV2> {
        return this.client.get<ScheduledReportV2>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/schedule/${scheduleId}`,
        });
    }

    /**
     * Get list of schedules for given account_id.
     * GET
     * /cargo/v2/:account_id/schedule
     * "https://api.cloudinsight.alertlogic.com/cargo/v2/13334567/schedule"
     *
     *  @param  accountId AIMS Account ID
     *  @param filterByType schedule type "search", "tableau"
     *  @returns a promise with the schedule data
     *  @remarks
     *  https://console.account.product.dev.alertlogic.com/users/api/index.html#api-Schedules-ListSchedules
     */
    async getAllSchedules(accountId: string, filterByType?: string): Promise<ScheduledReportListV2> {
        const params: { type?: string } = {};
        if (filterByType) {
            params.type = filterByType;
        }
        return this.client.get<ScheduledReportListV2>({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/schedule`,
            params: params
        });
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
    async deleteSchedule(accountId: string, scheduleId: string) {
        const scheduleDelete = await this.client.delete({
            service_stack: AlLocation.InsightAPI,
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
    async updateSchedule(accountId: string, reportId: string, schedule: ScheduledReportV2) {
        return this.client.post<ScheduledReportV2>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/schedule/${reportId}`,
            data: schedule
        });
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
    async cancelScheduledReport(accountId: string, executionRecordId: string) {
        const result = await this.client.post({
            service_stack: AlLocation.InsightAPI,
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
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/execution_record/count`,
            params: { schedule_id: scheduleId }
        });

        return result.execution_record_count as number;
    }

    /**
     * Create execution record for given account_id. This API allows to manually submit execution record for existing schedule definition
     * or create run-once record, which will be run only once immediately after submitting.
     * In case of run_once record, the request body should include schedule records spec.
     * POST
     * /cargo/v2/:account_id/execution_record
     * "https://api.cloudinsight.alertlogic.com/cargo/v2/13334567/execution_record"
     *
     *  @param accountId The AIMS Account ID
     *  @param payload contains the execution record definition
     *  @returns a promise with the result
     *  @remarks
     *  https://console.account.product.dev.alertlogic.com/users/api/cargo/index.html#api-Execution_Records-CreateExecutionRecord
     */
    async createExecutionRecord(accountId: string, payload: ExecutionRecordRequestV2 | ExecutionRecordOnceRequestV2) {
        const result = await this.client.post({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/execution_record`,
            data: payload
        });

        return result;
    }

    /**
     * Retrieve tar archive with execution record run results for given account_id and multiple execution_record_ids.
     * GET
     * /cargo/v2/:account_id/execution_record/archive
     * "https://api.cloudinsight.alertlogic.com/cargo/v2/13334567/execution_record/archive"
     *
     *  @param accountId The AIMS Account ID
     *  @param executionRecordIds String could be contains one or more record IDs separate by comas
     *  @returns a tar archive.
     *  @remarks
     *  https://console.account.product.dev.alertlogic.com/users/api/cargo/index.html#api-Execution_Records-GetExecutionRecordMultipleResult
     */
    async getExecutionRecordResultsArchive(accountId: string, executionRecordIds: string): Promise<unknown> {
        const result = await this.client.get({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: "/execution_record/archive",
            params: { execution_record_ids: executionRecordIds },
            response_type: 'arraybuffer'
        });

        return result;
    }

    /**
     * Create execution record for given account_id. This API allows to manually submit execution record for existing schedule definition
     * or create run-once record, which will be run only once immediately after submitting.
     * In case of run_once record, the request body should include schedule records spec.
     * GET
     * /cargo/v2/:account_id/execution_record/:execution_record_id/result
     * "https://api.cloudinsight.alertlogic.com/cargo/v2/13334567/execution_record/20160801-183000-FB3D65D4-3905-1005-894D-0EA0987B68E5/result"
     *
     *  @param accountId The AIMS Account ID
     *  @param executionRecordId The Execution Record ID
     *  @returns a promise with the report execution blob.
     *  @remarks
     *  https://console.account.product.dev.alertlogic.com/users/api/cargo/index.html#api-Execution_Records-GetExecutionRecordResult
     */
    async getExecutionRecordResult(accountId: string, executionRecordId: string): Promise<unknown> {
        const result = await this.client.get({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/execution_record/${executionRecordId}/result`,
            response_type: 'arraybuffer',
        });

        return result;
    }

    /**
     * Get execution record for given account_id and execution_record_id.
     * GET
     * /cargo/v2/:account_id/execution_record/:execution_record_id
     * "https://api.cloudinsight.alertlogic.com/cargo/v2/13334567/execution_record/20160808-073000-FB3D65D4-3905-1005-894D-0EA0987B68E5"
     *
     *  @param accountId The AIMS Account ID
     *  @param executionRecordId The Execution Record ID
     *  @returns a promise with the execution record
     *  @remarks
     *  https://console.account.product.dev.alertlogic.com/users/api/cargo/index.html#api-Execution_Records-GetExecutionRecord
     */
    async getExecutionRecord(accountId: string, executionRecordId: string): Promise<ExecutionRecordV2> {
        return this.client.get<ExecutionRecordV2>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/execution_record/${executionRecordId}`
        });
    }

    /**
     * List execution records for given account_id.
     * GET
     * /cargo/v2/:account_id/execution_record
     * "https://api.cloudinsight.alertlogic.com/cargo/v2/13334567/execution_record"
     *
     *  @param accountId The AIMS Account ID
     *  @returns a promise with the list execution records
     *  @remarks
     *  https://console.account.product.dev.alertlogic.com/users/api/cargo/index.html#api-Execution_Records-ListExecutionRecords
     */
    async getListExecutionRecords(accountId: string, queryParams?: ExecutionRecordsQueryParamsV2): Promise<ExecutionRecordListV2> {
        return this.client.get<ExecutionRecordListV2>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/execution_record`,
            params: queryParams
        });
    }

    /**
     * Remove execution record for given account_id and execution_record_id.
     * DELETE
     * /cargo/v2/:account_id/execution_record/:execution_record_id
     * "https://api.global-integration.product.dev.alertlogic.com/cargo/v2/13334567/execution_record/20160801-213000-FB3D65D4-3905-1005-894D-0EA0987B68E5"
     *
     *  @param  accountId The AIMS Account ID
     *  @param  executionRecordId  The Execution Record ID
     *  @returns just the status code
     *
     *  @remarks
     *  https://console.account.product.dev.alertlogic.com/users/api/index.html#api-Execution_Records-RemoveExecutionRecord
     */
    async deleteExecutionRecord(accountId: string, executionRecordId: string) {
        const result = await this.client.delete({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/execution_record/${executionRecordId}`
        });

        return result;
    }

    /**
     * Delete multiple schedule records for given accountId and an array of schedule ids
     * DELETE
     * /cargo/v2/:account_id/schedule
     * https://api.product.dev.alertlogic.com/cargo/v2/1/schedule?ids=27C13BFD-3953-1005-BD8A-0EB9B569AE5D,A63DD975-9DFB-1005-9763-6C400896AB14
     *
     * @param accountId The AIMS Account ID
     * @param ids is an array with schedule id's
     * @returns just the status code
     *
     * @remarks
     * https://console.product.dev.alertlogic.com/api/cargo/#api-Schedules-BatchRemoveSchedules
     *
     */
    async batchDeleteSchedules(accountId: string, ids: string[]) {
        const strIds = ids.join(',');
        return await this.client.delete({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/schedule?ids=${strIds}`
        });
    }

    /**
     * Delete multiple execution records for given accountId and an array of execution ids
     * DELETE
     * /cargo/v2/:account_id/execution_record
     * https://api.product.dev.alertlogic.com/cargo/v2/1/execution_record?ids=27C13BFD-3953-1005-BD8A-0EB9B569AE5D,A63DD975-9DFB-1005-9763-6C400896AB14
     *
     * @param accountId The AIMS Account ID
     * @param ids is an array with execution id's
     * @returns just the status code
     *
     * @remarks
     * https://console.product.dev.alertlogic.com/api/cargo/#api-Execution_Records-BatchRemoveExecutionRecords
     *
     */
    async batchDeleteExecutionRecords(accountId: string, ids: string[]) {
        const strIds = ids.join(',');
        return await this.client.delete({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/execution_record?ids=${strIds}`
        });
    }

}
