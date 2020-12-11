/**
 * Responder API client
 */
import {
    AlApiClient,
    AlDefaultClient,
    AlLocation
} from '@al/core';
import {
    AlResponderPlaybook,
    AlResponderAction,
    AlResponderExecutions,
    AlResponderInspectorError,
    AlResponderExecutionResult,
    AlResponderExecutionQueryParams,
    AlResponderSchema,
    AlResponderExecutionsHistoryResult,
    AlResponderExecutionsHistoryQueryParams
} from './types';

export class AlResponderClientInstance {

    protected client: AlApiClient;
    protected serviceVersion = 'v1';
    protected serviceStack = AlLocation.ResponderAPI;

    constructor(client: AlApiClient = null) {
        this.client = client || AlDefaultClient;
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
    async getPlaybooks(accountId: string) {
        return this.client.get<AlResponderPlaybook[]>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            account_id: accountId,
            path: `/playbooks`
        });
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
    async deletePlaybookById(accountId: string, id: string) {
        const result = await this.client.delete({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            account_id: accountId,
            path: `/playbooks/${id}`
        });
        return result;
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
    async getActions(accountId: string, params?: {payload_type: string}) {
        return this.client.get<AlResponderAction[]>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            account_id: accountId,
            path: `/actions`,
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
        payload: {
            type: string;
            payload: object;
            playbook_id: string
          }): Promise<AlResponderExecutions> {
        return this.client.post<AlResponderExecutions>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            account_id: accountId,
            path: `/executions`,
            data: payload
        });
    }

     /**
     * Get execution results
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
    async getExecutionResults(accountId: string, executionId: string): Promise<AlResponderExecutionResult> {
        return this.client.get<AlResponderExecutionResult>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            account_id: accountId,
            path: `/executions/${executionId}`,
        });
    }

    /**
     * Get execution results
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
    async getExecutionsHistory(accountId: string, payload: AlResponderExecutionsHistoryQueryParams): Promise<AlResponderExecutionsHistoryResult> {
        return this.client.post<AlResponderExecutionsHistoryResult>({
            data: payload,
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            account_id: accountId,
            path: `/executions/history`
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
    async inspectWorkflow(accountId: string,
        payload: {
            input_type: 'yaml' | 'json' ;
            workflow: any
          }): Promise<AlResponderInspectorError[]> {
        return this.client.post<AlResponderInspectorError[]>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
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
            account_id: accountId,
            path: `/schemas/${dataType}`,
        });
    }
}
