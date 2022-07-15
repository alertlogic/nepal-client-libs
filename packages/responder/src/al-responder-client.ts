/**
 * Responder API client
 */
import {
    AlApiClient,
    AlDefaultClient,
    AlLocation
} from '@al/core';
import {
    AlManagedResponsePayload,
    AlPlaybookRequest,
    AlPlaybookTemplate,
    AlResponderAction,
    AlResponderBlockHistoryList,
    AlResponderBlockHistoryPayload,
    AlResponderExecution,
    AlResponderExecutionQueryParams,
    AlResponderExecutionRequest,
    AlResponderExecutionResult,
    AlResponderExecutions,
    AlResponderExecutionsHistory,
    AlResponderExecutionsHistoryResult,
    AlResponderInquiries,
    AlResponderInquiry,
    AlResponderInspectorError,
    AlResponderLimits,
    AlResponderManageBlockStatusRequest,
    AlResponderMRAWSSNS,
    AlResponderMRAWSWAF,
    AlResponderMRDefinitionDetail,
    AlResponderMRDefinitions,
    AlResponderMRDeviceDefinitions,
    AlResponderMRDryRun,
    AlResponderMREventBridge,
    AlResponderMRGeneric,
    AlResponderMRList,
    AlResponderMRPaloAltoBlock,
    AlResponderMRStackstormAction,
    AlResponderPlaybook,
    AlResponderPlaybookDefinition,
    AlResponderPlaybooks,
    AlResponderPlaybookSummary,
    AlResponderPlaybookTrigger,
    AlResponderRoles,
    AlResponderSample,
    AlResponderSamples,
    AlResponderSchedule,
    AlResponderSchema,
    AlResponderTriggerQueryParams,
    AlResponderTriggers
} from './types';

export class AlResponderClientInstance {

    protected client: AlApiClient;
    protected serviceVersion = 'v1';
    protected serviceStack = AlLocation.ResponderAPI;
    protected targetEndpoint = "responder";

    constructor(client: AlApiClient = null) {
        this.client = client || AlDefaultClient;
    }

    /**
     * List all playbooks definitions
     * GET
     * /v1/playbook_definitions
     * https://responder.mdr.global.alertlogic.com
     *
     * @returns Playbook definitions
     *
     * @remarks
     *
     * */
    async getPlaybookDefinitions(): Promise<AlResponderPlaybookDefinition[]>{
        return this.client.get<AlResponderPlaybookDefinition[]>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            path: `/playbook_definitions`
        });
    }

    /**
     * List playbooks ake in account the list is limited to 100 items
     * GET
     * /v1/{account_id}/playbooks
     * https://responder.mdr.global.alertlogic.com
     *
     * @param accountId AIMS Account ID
     * @returns Playbook list
     *
     * @remarks
     *
     * */
    async getPlaybooks(accountId: string, parameters: AlPlaybookRequest = {}):Promise<AlResponderPlaybooks> {
        return this.client.get<AlResponderPlaybooks>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/playbooks`,
            params: parameters
        });
    }

    /**
     * List all playbooks
     * GET
     * /v1/{account_id}/playbooks
     * https://responder.mdr.global.alertlogic.com
     *
     * @param accountId AIMS Account ID
     * @returns Playbook list
     *
     * @remarks
     *
     * */
    async getAllPlaybooks(accountId: string, parameters: AlPlaybookRequest = {}): Promise<AlResponderPlaybook[]> {
        let playbooks = [];
        let marker = undefined;

        const staticParams = {
            ...{ limit: 100 },
            ...parameters
        };

        do {
            const params = {
                ...staticParams,
                ...marker ? { marker } : {}
            };
            const result = await this.client.get<AlResponderPlaybooks>({
                version: this.serviceVersion,
                service_stack: this.serviceStack,
                target_endpoint: this.targetEndpoint,
                account_id: accountId,
                path: `/playbooks`,
                params: params
            });

            playbooks = playbooks.concat(result.playbooks);
            marker = result.marker || undefined;
        } while (marker);

        return playbooks;
    }

    /**
     * Get Playbook by id or name
     * GET
     * /v1/{account_id}/playbooks/{id}
     * https://responder.mdr.global.alertlogic.com
     *
     * @param accountId AIMS Account ID
     * @param id Playbook ID or Playbook Name
     * @returns an existing playbook
     *
     * @remarks
     *
     * */
    async getPlaybookById(accountId: string, id: string): Promise<AlResponderPlaybook> {
        return this.client.get<AlResponderPlaybook>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/playbooks/${id}`
        });
    }

    /**
     * Create a new playbook
     * POST
     * /v1/{account_id}/playbooks
     *
     * @param accountId AIMS Account ID
     * @param payload
     * @returns a promise with the new playbook
     *
     * @remarks
     */
    async createPlaybook(accountId: string,
        payload: AlResponderPlaybook): Promise<AlResponderPlaybook> {
        return this.client.post<AlResponderPlaybook>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/playbooks`,
            data: payload
        });
    }

    /**
     * Update existing playbook
     * PUT
     * /v1/{account_id}/playbooks/{id}
     *
     * @param accountId AIMS Account ID
     * @param id Playbook ID or Playbook Name
     * @param payload
     * @returns a promise with the updated playbook
     *
     * @remarks
     */
    async updatePlaybook(accountId: string,
        id: string,
        payload: AlResponderPlaybook): Promise<AlResponderPlaybook> {

        return this.client.put<AlResponderPlaybook>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/playbooks/${id}`,
            data: payload
        });
    }

    /**
     * Delete existing playbook
     * DELETE
     * /v1/{account_id}/playbooks/{id}
     *
     * @param accountId AIMS Account ID
     * @param id Playbook ID or Playbook Name
     * @returns just the status code 204, 403, 404
     *
     * @remarks
     */
    async deletePlaybookById(accountId: string, id: string): Promise<void> {
        return await this.client.delete({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/playbooks/${id}`
        });
    }


    /**
     * List playbooks by vendor summary
     * GET
     * /v1/{account_id}/summary/playbooks
     * https://responder.mdr.global.alertlogic.com
     *
     * @param accountId AIMS Account ID
     * @returns Summary by vendor
     *
     * @remarks
     *
     * */
    async getPlaybookSummary(accountId: string): Promise<AlResponderPlaybookSummary> {
        return this.client.get<AlResponderPlaybookSummary>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/summary/playbooks`
        });
    }

    /**
     * List actions
     * GET
     * /v1/{account_id}/actions
     * https://responder.mdr.global.alertlogic.com
     *
     * @param accountId AIMS Account ID
     * @param params
     * @returns Actions list
     *
     * @remarks
     *
     * */
    async getActions(accountId: string, params?: { payload_type: string }): Promise<AlResponderAction[]> {
        return this.client.get<AlResponderAction[]>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/actions`,
            params: params
        });
    }


    /**
     * Get actions by ref
     * GET
     * /v1/{account_id}/actions/{action_ref}
     * https://responder.mdr.global.alertlogic.com
     *
     * @param accountId AIMS Account ID
     * @param actionRef Action ref
     * @param params
     * @returns Action
     *
     * @remarks
     *
     * */
    async getActionByRef(accountId: string, actionRef: string, params?: { payload_type: string }): Promise<AlResponderAction> {
        return this.client.get<AlResponderAction>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/actions/${actionRef}`,
            params: params
        });
    }

    /**
     * List execution
     * GET
     * /v1/{account_id}/executions
     * https://responder.mdr.global.alertlogic.com
     *
     * @param accountId AIMS Account ID
     * @returns Executions list
     *
     * @remarks
     *
     * */
    async getExecutions(accountId: string, params: AlResponderExecutionQueryParams): Promise<AlResponderExecutions> {
        return this.client.get<AlResponderExecutions>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/executions`,
            params: params
        });
    }

    /**
     * Execute specified playbook
     * POST
     * /v1/{account_id}/executions
     *
     * @param accountId AIMS Account ID
     * @param payload
     * @returns a promise with the execution record
     *
     * @remarks
     */
    async createExecution(accountId: string,
        payload: AlResponderExecutionRequest): Promise<AlResponderExecutions> {
        return this.client.post<AlResponderExecutions>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/executions`,
            data: payload
        });
    }

    /**
     * GET
     * /v1/{account_id}/executions/{id}/result
     * https://responder.mdr.global.alertlogic.com
     *
     * @param accountId AIMS Account ID
     * @param executionId Execution Id
     * @returns Execution result
     *
     * @remarks
     *
     * */
    async getExecutionResult(accountId: string, executionId: string): Promise<AlResponderExecutionResult> {
        return this.client.get<AlResponderExecutionResult>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/executions/${executionId}`,
        });
    }

    /**
     * GET
     * /v1/{account_id}/executions/history
     * https://responder.mdr.global.alertlogic.com
     *
     * @param accountId AIMS Account ID
     * @param params AlResponderExecutionQueryParams params
     * @returns Execution history list
     *
     * @remarks
     *
     * */
    async getExecutionsHistory(accountId: string, payload: AlResponderExecutionQueryParams): Promise<AlResponderExecutionsHistoryResult> {
        return this.client.post<AlResponderExecutionsHistoryResult>({
            data: payload,
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/executions/history`
        });
    }

    /**
     * GET
     * /v1/{account_id}/executions/history/{type}/{id}
     * https://responder.mdr.global.alertlogic.com
     *
     * @param accountId AIMS Account ID
     * @param type execution type:playbook, task, action
     * @param id execution id
     * @returns Execution history detail
     *
     * @remarks
     *
     * */
    async getExecutionsHistoryById(accountId: string, type: string, executionId:string ): Promise<AlResponderExecutionsHistory> {
        return this.client.get<AlResponderExecutionsHistory>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/executions/history/${type}/${executionId}`
        });
    }

    /**
     * Re-run previosly executed playbook, Creates a new exection from a previously run exection.
     * POST
     * /v1/{account_id}/executions/{execution_id}/re_run
     *
     * @param accountId AIMS Account ID
     * @param executionId Execution Id
     * @param payload delay How long (in milliseconds) to delay the execution before scheduling
     * @returns a promise with the new execution
     *
     * @remarks
     */
    async reRunExecution(accountId: string,
        executionId: string,
        payload: {
            delay: number;
        }): Promise<AlResponderExecution> {
        return this.client.post<AlResponderExecution>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/executions/${executionId}/re_run`,
            data: payload
        });
    }

    /**
     * Pauses running execution
     * POST
     * /v1/{account_id}/executions/{execution_id}/pause
     *
     * @param accountId AIMS Account ID
     * @param executionId Execution Id
     * @returns a promise with the 204 or 404
     *
     * @remarks
     */
    async pauseExecution(accountId: string,
        executionId: string): Promise<void> {
        return this.client.post<void>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/executions/${executionId}/pause`,
        });
    }


    /**
     * Resumes paused execution
     * POST
     * /v1/{account_id}/executions/{execution_id}/resume
     *
     * @param accountId AIMS Account ID
     * @param executionId Execution Id
     * @returns a promise with the 204 or 404
     *
     * @remarks
     */
    async resumeExecution(accountId: string,
        executionId: string): Promise<void> {
        return this.client.post<void>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/executions/${executionId}/resume`,
        });
    }

    /**
     * Cancels Execution
     * DELETE
     * /v1/{account_id}/executions/{execution_id}
     *
     * @param accountId AIMS Account ID
     * @param id Execution_id
     * @returns just the status code 204, 403, 404
     *
     * @remarks
     */
    async deleteExecutionById(accountId: string, id: string):Promise<void> {
        return await this.client.delete({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/executions/${id}`
        });
    }

    /**
     * Checks workflow document and returns a list of errors if any are found
     * POST
     * /v1/{account_id}/workflow/inspect
     *
     * @param accountId AIMS Account ID
     * @param payload
     * @returns a promise with the new playbook
     *
     * @remarks
     */
    async inspectWorkflow(
        accountId: string,
        payload: {
            input_type: 'yaml' | 'json';
            workflow: any;
            parameters?: {};
        },
    ): Promise<AlResponderInspectorError[]> {
        return this.client.post<AlResponderInspectorError[]>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/workflow/inspect`,
            data: payload
        });
    }

    /**
     * Get schemas for customer
     * GET
     * /v1/{account_id}/schemas
     * https://responder.mdr.global.alertlogic.com
     *
     * @param accountId AIMS Account ID
     * @returns Schemas
     *
     * @remarks
     *
     * */
    async getSchema(accountId: string): Promise<AlResponderSchema[]> {
        return this.client.get<AlResponderSchema[]>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/schemas`,
        });
    }

    /**
     * Get schemas by type
     * GET
     * /v1/{account_id}/schemas/{data_type}
     * https://responder.mdr.global.alertlogic.com
     *
     * @param accountId AIMS Account ID
     * @param dataType Data type name to return JSON schema for
     * @returns Schema Detail
     *
     * @remarks
     *
     * */
    async getSchemaByType(accountId: string, dataType: string): Promise<AlResponderSchema> {
        return this.client.get<AlResponderSchema>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/schemas/${dataType}`,
        });
    }

    /**
     * Get inquiries by account
     * GET
     * /v1/{account_id}/inquiries
     * https://responder.mdr.global.alertlogic.com
     *
     * @param accountId AIMS Account ID
     * @returns Inquiries list
     *
     * @remarks
     *
     * */
    async getInquiries(accountId: string): Promise<AlResponderInquiries> {
        return this.client.get<AlResponderInquiries>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/inquiries`,
        });
    }

    /**
     * Get inquiries history by account
     * GET
     * /v1/{account_id}/inquiries/history
     * https://responder.mdr.global.alertlogic.com
     *
     * @param accountId AIMS Account ID
     * @returns Inquiries list
     *
     * @remarks
     *
     * */
    async getInquiriesHistory(accountId: string, request: AlResponderExecutionQueryParams): Promise<AlResponderInquiries> {
        return this.client.post<AlResponderInquiries>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/inquiries/history`,
            data: request
        });
    }

    /**
     * Returns a specific inquiry
     * GET
     * /v1/{account_id}/inquiries
     * https://responder.mdr.global.alertlogic.com
     *
     * @param accountId AIMS Account ID
     * @param inquiryId Inquiry Id
     * @returns Inquiries list
     *
     * @remarks
     *
     * */
    async getInquiry(accountId: string, inquiryId: string): Promise<AlResponderInquiry> {
        return this.client.get<AlResponderInquiry>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/inquiries/${inquiryId}`,
        });
    }

    /**
     * Update existing inquiry
     * PUT
     * /v1/{account_id}/inquiries
     * https://responder.mdr.global.alertlogic.com
     *
     * @param accountId AIMS Account ID
     * @returns Inquiry
     *
     * @remarks
     *
     * */
    async updateInquiry(
        accountId: string,
        inquiryId: string,
        payload: { [key: string]: unknown })
        : Promise<{ id: string; response: { [key: string]: unknown } }> {
        return this.client.put<{ id: string; response: { [key: string]: unknown } }>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/inquiries/${inquiryId}`,
            data: payload
        });
    }

    /**
     * Get schedules by account
     * GET
     * /v1/{account_id}/schedules
     * https://responder.mdr.global.alertlogic.com
     *
     * @param accountId AIMS Account ID
     * @returns Schedules list
     *
     * @remarks
     *
     * */
    async getSchedules(accountId: string): Promise<AlResponderSchedule[]> {
        return this.client.get<AlResponderSchedule[]>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/schedules`,
        });
    }

    /**
     * Create a new schedule
     * POST
     * /v1/{account_id}/schedules
     *
     * @param accountId AIMS Account ID
     * @param schedule
     * @returns a promise with the new schedule
     *
     * @remarks
     */
    async createSchedule(accountId: string,
        payload: AlResponderSchedule): Promise<AlResponderSchedule> {
        return this.client.post<AlResponderSchedule>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/schedules`,
            data: payload
        });
    }

    /**
     * Deletes existing schedule
     * DELETE
     * /v1/{account_id}/schedules/{id}
     *
     * @param accountId AIMS Account ID
     * @param id Schedules ID
     * @returns just the status code 204, 403, 404
     *
     * @remarks
     */
    async deleteScheduleById(accountId: string, id: string): Promise<void> {
        return await this.client.delete({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/schedules/${id}`
        });
    }

    /**
    * Update existing Schedule
    * PUT
    * /v1/{account_id}/schedules/{id}
    *
    * @param accountId AIMS Account ID
    * @param id Schedule id
    * @param payload
    * @returns a promise with the updated schedule
    *
    * @remarks
    */
    async updateSchedule(accountId: string,
        id: string,
        payload: AlResponderSchedule): Promise<AlResponderSchedule> {
        return this.client.put<AlResponderSchedule>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/schedules/${id}`,
            data: payload
        });
    }

    /**
     * Get Schedule by id
     * GET
     * /v1/{account_id}/schedules/{id}
     * https://responder.mdr.global.alertlogic.com
     *
     * @param accountId AIMS Account ID
     * @param id Schedule ID
     * @returns an existing schedule
     *
     * @remarks
     *
     * */
    async getScheduleById(accountId: string, id: string): Promise<AlResponderSchedule> {
        return this.client.get<AlResponderSchedule>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/schedules/${id}`
        });
    }

    /**
     * List system payload samples
     * GET
     * /v1/payload_samples
     * https://responder.mdr.global.alertlogic.com
     *
     * @returns Returns system payload samples
     *
     * @remarks
     *
     * */
    async getSystemSamples(): Promise<AlResponderSamples> {
        return this.client.get<AlResponderSamples>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            path: `/payload_samples`
        });
    }


    /**
     * List customer payload samples
     * GET
     * /v1/{account_id}/payload_samples
     * https://responder.mdr.global.alertlogic.com
     *
     * @param accountId AIMS Account ID
     * @returns Returns customer payload samples
     *
     * @remarks
     *
     * */
    async getSamples(accountId: string): Promise<AlResponderSamples> {
        return this.client.get<AlResponderSamples>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/payload_samples`
        });
    }


    /**
    /*
     * Create a new payload sample
     * POST
     * /v1/{account_id}/payload_samples
     *
     * @param accountId AIMS Account ID
     * @param payload_sample
     * @returns a promise with the sample
     *
     * @remarks
     */
    async createPayloadSample(accountId: string,
        payload: AlResponderSample): Promise<AlResponderSample> {
        return this.client.post<AlResponderSample>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/payload_samples`,
            data: payload
        });
    }

    /**
     * Delete existing payload sample by id and per account
     * DELETE
     * /v1/{account_id}/payload_samples/{id}
     *
     * @param accountId AIMS Account ID
     * @param id Payload sample id
     * @returns just the status code 204, 404
     *
     * @remarks
     */
    async deletePayloadSampleById(accountId: string, id: string): Promise<void> {
        return await this.client.delete({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/payload_samples/${id}`
        });
    }

    /**
    * Update payload sample
    * PUT
    * /v1/{account_id}/payload_samples/{id}
    *
    * @param accountId AIMS Account ID
    * @param id payload sample id
    * @param payload
    * @returns a promise with the updated payload sample
    *
    * @remarks
    */
    async updatePayloadSample(accountId: string,
        id: string,
        payload: AlResponderSample): Promise<AlResponderSample> {
        return this.client.put<AlResponderSample>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/payload_samples/${id}`,
            data: payload
        });
    }

    /**
     * Get triggers by account
     * GET
     * /v1/{account_id}/triggers
     * https://responder.mdr.global.alertlogic.com
     *
     * @param accountId AIMS Account ID
     * @returns Triggers list
     *
     * @remarks
     *
     * */
    async getTriggers(accountId: string, params?: AlResponderTriggerQueryParams): Promise<AlResponderTriggers> {
        return this.client.get<AlResponderTriggers>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/triggers`,
            params: params
        });
    }

    /**
     * Get trigger by ID
     * GET
     * /v1/{account_id}/triggers/{id}
     * https://responder.mdr.global.alertlogic.com
     *
     * @param accountId AIMS Account ID
     * @param triggerId A trigger ID
     * @returns A trigger definition
     *
     * @remarks
     *
     * */
    async getTrigger(accountId: string, triggerId: string): Promise<AlResponderPlaybookTrigger> {
        return this.client.get<AlResponderPlaybookTrigger>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/triggers/${triggerId}`,
        });
    }

    /**
     * Update a trigger by ID
     * GET
     * /v1/{account_id}/triggers/{id}
     * https://responder.mdr.global.alertlogic.com
     *
     * @param accountId AIMS Account ID
     * @param triggerId A trigger ID
     * @param trigger Trigger Definition
     * @returns The updated trigger definition
     *
     * @remarks
     *
     * */
    async updateTrigger(accountId: string, triggerId: string, trigger: AlResponderPlaybookTrigger): Promise<AlResponderPlaybookTrigger> {
        return this.client.put<AlResponderPlaybookTrigger>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/triggers/${triggerId}`,
            data: trigger
        });
    }

    /**
     * Delete a trigger by ID
     * GET
     * /v1/{account_id}/triggers/{id}
     * https://responder.mdr.global.alertlogic.com
     *
     * @param accountId AIMS Account ID
     * @param triggerId A trigger ID
     *
     * @remarks
     *
     * */
    async deleteTrigger(accountId: string, triggerId: string): Promise<void> {
        return this.client.delete({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/triggers/${triggerId}`
        });
    }

    /**
     * Create a Trigger
     * GET
     * /v1/{account_id}/triggers
     * https://responder.mdr.global.alertlogic.com
     *
     * @param accountId AIMS Account ID
     * @param trigger Trigger Definition
     * @returns The created trigger
     *
     * @remarks
     *
     * */
    async createTrigger(accountId: string, trigger: AlResponderPlaybookTrigger): Promise<AlResponderPlaybookTrigger> {
        return this.client.post<AlResponderPlaybookTrigger>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/triggers`,
            data: trigger
        });
    }

    /**
     * List playbook templates
     * GET
     * /v1/{account_id}/playbook_templates
     *
     * @param accountId AIMS Account ID
     * @returns Returns playbook templates
     *
     */
    async getTemplates(accountId: string,
        parameters: {include_parents?: boolean} = {}): Promise<{playbook_templates: AlPlaybookTemplate[]}> {
        return this.client.get<{playbook_templates: AlPlaybookTemplate[]}>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/playbook_templates`,
            params: parameters
        });
    }

    /**
    /*
     * Creates playbook template
     * POST
     * /v1/{account_id}/playbook_templates
     *
     * @param accountId AIMS Account ID
     * @param payload_sample
     * @returns a promise with the sample
     *
     * @remarks
     */
    async createTemplate(accountId: string, payload: AlPlaybookTemplate): Promise<AlPlaybookTemplate> {
        return this.client.post<AlPlaybookTemplate>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/playbook_templates`,
            data: payload
        });
    }

    /**
     * Get Template by id
     * GET
     * /v1/{account_id}/playbook_templates/{id}
     * https://responder.mdr.global.alertlogic.com
     *
     * @param accountId AIMS Account ID
     * @param id Template ID
     * @returns an existing playbook template
     * */
    async getTemplateById(accountId: string, id: string): Promise<AlPlaybookTemplate> {
        return this.client.get<AlPlaybookTemplate>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/playbook_templates/${id}`
        });
    }

    /**
     * Delete existing playbook template by id and per account
     * DELETE
     * /v1/{account_id}/playbook_templates/{id}
     *
     * @param accountId AIMS Account ID
     * @param id Playbook template id
     * @returns just the status code 204, 404
     *
     * @remarks
     */
    async deleteTemplateById(accountId: string, id: string): Promise<void> {
        const result = await this.client.delete({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/playbook_templates/${id}`
        });
        return result;
    }

    /**
    * Update playbook template
    * PUT
    * /v1/{account_id}/playbook_templates/{id}
    *
    * @param accountId AIMS Account ID
    * @param id Playbook template id
    * @param payload
    * @returns a promise with the updated playbook template
    *
    * @remarks
    */
    async updateTemplate(accountId: string,
        id: string,
        payload: AlPlaybookTemplate): Promise<AlPlaybookTemplate> {
        return this.client.put<AlPlaybookTemplate>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/playbook_templates/${id}`,
            data: payload
        });
    }

    /**
    * List of playbook roles for a customer account
    * GET
    * /v1/{account_id}/playbook_roles
    * https://responder.mdr.global.alertlogic.com
    *
    * @param accountId AIMS Account ID
    * @returns Playbook roles
    *
    */
    async getPlaybookRoles(accountId: string): Promise<AlResponderRoles> {
        return this.client.get<AlResponderRoles>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/playbook_roles`
        });
    }

    /**
    * List of trigger roles (trigger permission levels) for a customer account
    * GET
    * /v1/{account_id}/trigger_roles
    * https://responder.mdr.global.alertlogic.com
    *
    * @param accountId AIMS Account ID
    * @returns Trigger roles
    *
    */
    async getTriggerRoles(accountId: string): Promise<AlResponderRoles> {
        return this.client.get<AlResponderRoles>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/trigger_roles`
        });
    }

    /**
    * Get incident from Iris in responder (bifrost) format
    * GET
    * /v1/{account_id}/playbook_incidents/{incident_id}
    * https://responder.mdr.global.alertlogic.com
    *
    * @param accountId AIMS Account ID
    * @returns incident in bifrost format
    *
    */
    async getIncidentBifrostFormat(accountId: string, incidentId: string): Promise<any> {
        return this.client.get({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/playbook_incidents/${incidentId}`
        });
    }

    /**
     * Get list all MR config items for account
     * GET
     * /v1/{account_id}/mr_configs
     * https://responder.mdr.global.alertlogic.com
     * @param accountId {string} AIMS Account ID
     * @return {Promise<AlResponderMRList>}
     */
    async getMRConfigList(accountId: string, parameters: {[key: string]: string | boolean | number} = {}): Promise<AlResponderMRList> {
        return this.client.get({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            params: parameters,
            path: `/mr_configs`
        });
    }

    /**
     * Get MR config item by id
     * @param accountId {string} AIMS Account ID
     * @param id {string} MR config item id
     * @returns {Promise<AlResponderMRGeneric>}
     */
    async getMRConfigItemById(accountId: string, id: string): Promise<AlResponderMRGeneric> {
        return this.client.get({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/mr_configs/${id}`
        });
    }

    /**
     * Create new MR config item
     * POST
     * /v1/{account_id}/mr_configs
     * https://responder.mdr.global.alertlogic.com
     * @param accountId {string} AIMS Account ID
     * @param payload {AlResponderMRAWSWAF | AlResponderMRAWSSNS | AlResponderMREventBridge | AlResponderMRStackstormAction | AlResponderMRPaloAltoBlock}
     * @returns {Promise<void>}
     */
    async createMRConfigItem(
        accountId: string,
        payload: AlResponderMRAWSWAF | AlResponderMRAWSSNS | AlResponderMREventBridge | AlResponderMRStackstormAction | AlResponderMRPaloAltoBlock
    ): Promise<void> {
        return this.client.post<void>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            data: payload,
            path: `/mr_configs`
        });
    }

    /**
     * Update existing MR config item
     * PUT
     * /v1/{account_id}/mr_configs/{id}
     * https://responder.mdr.global.alertlogic.com
     * @param accountId {string} AIMS Account ID
     * @param id {string} MR config item id
     * @param payload {string}
     * @returns
     */
    async updateMRConfigItem(
        accountId: string,
        id: string,
        payload: AlResponderMRAWSWAF | AlResponderMRAWSSNS | AlResponderMREventBridge | AlResponderMRStackstormAction | AlResponderMRPaloAltoBlock
    ): Promise<void> {
        return this.client.put<void>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            data: payload,
            path: `/mr_configs/${id}`
        });
    }

    /**
     * Delete existing MR config item
     * DELETE
     * /v1/{account_id}/mr_configs/{id}
     * https://responder.mdr.global.alertlogic.com
     * @param accountId {string} AIMS Account ID
     * @param id {string} MR config item id
     * @returns
     */
    async deleteMRConfigItem(accountId: string, id: string): Promise<void> {
        return this.client.delete<void>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/mr_configs/${id}`
        });
    }

    /**
     * GET MR Config definitions list
     * GET
     * /v1/{accoutId}/definitions/mr_configs
     * https://responder.mdr.global.alertlogic.com
     * @param accountId {string} AIMS Account ID
     * @returns {Promise<AlResponderMRDefinitions>}
     */
    async getMRConfigDefinitions(accountId: string): Promise<AlResponderMRDefinitions> {
        return this.client.get({
            version: this.serviceVersion,
            target_endpoint: this.targetEndpoint,
            service_stack: this.serviceStack,
            account_id: accountId,
            path: `/definitions/mr_configs`
        });
    }

    /**
     * List all MR 'dry_run' reports for account
     * GET
     * /v1/{account_id}/mr_configs/dry_runs
     * https://responder.mdr.global.alertlogic.com
     * @param accountId {string} AIMS Account ID
     * @returns {Promise<Array<AlResponderMRDryRun>>}
     */
    async getMRDryRuns(accountId: string): Promise<Array<AlResponderMRDryRun>> {
        return this.client.get({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            path: `/mr_configs/dry_runs`
        });
    }

    /**
     * Initiate new dry run for specified MR config
     * POST
     * /v1/{account_id}/mr_configs/dry_runs
     * https://responder.mdr.global.alertlogic.com
     * @param accountId {string} AIMS Account ID
     * @param payload {AlResponderMRAWSWAF | AlResponderMRAWSSNS | AlResponderMREventBridge | AlResponderMRStackstormAction | AlResponderMRPaloAltoBlock}
     * @returns {Promise<{id: string}>}
     */
    async createMRDryRun(
        accountId: string,
        payload: AlResponderMRGeneric | AlResponderMRAWSWAF | AlResponderMRAWSSNS | AlResponderMREventBridge | AlResponderMRStackstormAction | AlResponderMRPaloAltoBlock
    ): Promise<{id: string}> {
        return this.client.post<{id: string}>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            target_endpoint: this.targetEndpoint,
            account_id: accountId,
            data: payload,
            path: `/mr_configs/dry_runs`
        });
    }

    /**
     * Get MR dry_run execution report
     * GET
     * /v1/{account_id}/mr_configs/dry_runs/{id}
     * https://responder.mdr.global.alertlogic.com
     * @param accountId {string} AIMS Account ID
     * @returns {Promise<AlResponderMRDryRun>}
     */
    async getMRDryRunById(accountId: string, id: string): Promise<AlResponderMRDryRun> {
        return this.client.get({
            version: this.serviceVersion,
            target_endpoint: this.targetEndpoint,
            service_stack: this.serviceStack,
            account_id: accountId,
            path: `/mr_configs/dry_runs/${id}`
        });
    }

    /**
     * GET MR Device definitions list
     * GET
     * /v1/{accoutId}/definitions/mr_devices
     */
    async getMRDevicesDefinitions(accountId: string): Promise<Array<AlResponderMRDeviceDefinitions>> {
        return this.client.get({
            version: this.serviceVersion,
            target_endpoint: this.targetEndpoint,
            service_stack: this.serviceStack,
            account_id: accountId,
            path: `/definitions/mr_devices`
        });
    }

    /**
     * Simple mode history
     * POST
     * @param accountId {string}
     * @param payload {AlResponderBlockHistoryPayload}
     * @returns {Promise<AlResponderBlockHistoryList>}
     */
    async getBlockHistory(accountId: string, payload: AlResponderBlockHistoryPayload): Promise<AlResponderBlockHistoryList> {
        return this.client.post({
            version: this.serviceVersion,
            target_endpoint: this.targetEndpoint,
            service_stack: this.serviceStack,
            account_id: accountId,
            data: payload,
            path: `/blocks/history`
        });
    }

    /**
     * GET MR Config definition detail by mr type
     * GET
     * /v1/{account_id}/definitions/mr_configs/{mr_type}
     * https://responder.mdr.global.alertlogic.com
     * @param accountId {string} AIMS Account ID
     * @params type {string} mr type
     * @returns {Promise<AlResponderMRDefinitionDetail>}
     */
    async getMRConfigDefinitionDetail(accountId: string, type: string): Promise<AlResponderMRDefinitionDetail> {
        return this.client.get({
            version: this.serviceVersion,
            target_endpoint: this.targetEndpoint,
            service_stack: this.serviceStack,
            account_id: accountId,
            path: `/definitions/mr_configs/${type}`
        });
    }

    /**
     * Manage Block Status
     * POST
     * @param accountId {string}
     * @param payload {AlResponderManageBlockStatusRequest}
     * @returns {Promise<string>}
     */
    async manageBlockStatus(accountId: string, payload: AlResponderManageBlockStatusRequest): Promise<string> {
        return this.client.post({
            version: this.serviceVersion,
            target_endpoint: this.targetEndpoint,
            service_stack: this.serviceStack,
            account_id: accountId,
            data: payload,
            path: `/blocks/manage`
        });
    }

    /**
     * Execute specific managed response for an incident
     * POST
     * @param accountId {string}
     * @param requestBody {AlManagedResponsePayload}
     * @returns {Promise<unknown>}
     */
    async managedResponse(accountId: string, requestBody: AlManagedResponsePayload, params?: { dry_run: boolean }): Promise<unknown> {
        return this.client.post({
            version: this.serviceVersion,
            target_endpoint: this.targetEndpoint,
            service_stack: this.serviceStack,
            account_id: accountId,
            data: requestBody,
            params: params,
            path: `/managed_response`
        });
    }

    /**
     * Get limits for the creation of paybooks, tasks, triggers, simple responses and exclusions
     * GET
     * /v1/{account_id}/limits
     * https://responder.mdr.global.alertlogic.com
     * @param accountId {string} AIMS Account ID
     * @returns {Promise<AlResponderLimits>}
     */
    async getLimits(accountId: string): Promise<AlResponderLimits> {
        return this.client.get({
            version: this.serviceVersion,
            target_endpoint: this.targetEndpoint,
            service_stack: this.serviceStack,
            account_id: accountId,
            path: `/limits`
        });
    }
}
