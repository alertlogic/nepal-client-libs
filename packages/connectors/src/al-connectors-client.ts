/**
 * Integrations API client
 */
import {
    AlApiClient,
    AlDefaultClient,
    AlLocation
} from '@al/core';
import {
    AlIntegrationType,
    AlIntegrationTypeDetail,
    AlIntegrationConnection,
    AlConnectorsPayloadTypes,
    AlConnectionTargets,
    AlConnectionTargetType
} from './types';

export class AlConnectorsClientInstance {

    protected client: AlApiClient;
    protected serviceVersion = 'v1';
    protected serviceStack = AlLocation.IntegrationsAPI;

    constructor(client: AlApiClient = null) {
        this.client = client || AlDefaultClient;
    }

    /**
     * Get a list of supported integration types
     * GET
     * /v1/integration_types
     * https://integrations.mdr.global.alertlogic.com
     *
     *  @returns a list of integration types
     *
     *  @remarks
     *
     * */
    async getIntegrationTypes(): Promise<AlIntegrationType[]> {
        return this.client.get<AlIntegrationType[]>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            path: '/integration_types'
        });
    }

    /**
     * Get a list of supported integration types by account
     * GET
     * /v1/{account_id}/integration_types/{name}
     * https://integrations.mdr.global.alertlogic.com
     *
     *  @param accountId account id
     *  @param name integration name
     *  @returns a list of integration types
     *
     *  @remarks
     *
     * */
    async getIntegrationTypeByAccount(accountId: string, name:string): Promise<AlIntegrationTypeDetail> {
        return this.client.get<AlIntegrationTypeDetail>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            path: `/integration_types/${name}`,
            account_id: accountId
        });
    }

    /**
     * Get integration type details
     * GET
     * /v1/integration_types/{name}
     * https://integrations.mdr.global.alertlogic.com
     *
     *  @returns an integration type
     *
     *  @remarks
     *
     * */
    async getIntegrationTypeByName(name:string): Promise<AlIntegrationTypeDetail> {
        return this.client.get<AlIntegrationTypeDetail>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            path: `/integration_types/${name}`
        });
    }

    /**
     * Returns Integration Connection Information
     * GET
     * /v1/{account_id}/connections
     * https://integrations.mdr.global.alertlogic.com
     *
     *  @returns an existing connection
     *
     *  @remarks
     *
     * */
    async getConnections(accountId: string, params?: {include_sample_payload: boolean}): Promise< AlIntegrationConnection[]> {
        return this.client.get<AlIntegrationConnection[]>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            account_id: accountId,
            params: params,
            path: `/connections`
        });
    }

    /**
     * Returns Integration Connection Information
     * GET
     * /v1/{account_id}/connections/{id}
     * https://integrations.mdr.global.alertlogic.com
     *
     *  @returns an existing connection
     *
     *  @remarks
     *
     * */
    async getConnectionById(accountId: string, connectionId: string): Promise<AlIntegrationConnection> {
        return this.client.get<AlIntegrationConnection>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            account_id: accountId,
            path: `/connections/${connectionId}`
        });
    }

    /**
     * Create a connection
     * POST
     * /v1/{account_id}/connections
     *
     * @param accountId account id
     * @param payload
     * @param dryRun
     * @returns a promise with the new connection
     *
     * @remarks
     */
    async createConnection(accountId: string,
        payload: AlIntegrationConnection,
        dryRun: boolean): Promise<AlIntegrationConnection> {
        return this.client.post<AlIntegrationConnection>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            account_id: accountId,
            path: `/connections`,
            params: {
                dry_run: dryRun
            },
            data: payload
        });
    }

    /**
     * Update a connection
     * PUT
     * /v1/{account_id}/connections/{id}
     *
     * @param accountId account id
     * @param connectionId connection id
     * @param payload
     * @param dryRun When present and set to true just tests the connection without updating an existing connection instance.
     * @returns a promise with the new connection
     *
     * @remarks
     */
    async updateConnection(accountId: string,
        connectionId: string,
        payload: AlIntegrationConnection,
        dryRun: boolean = false): Promise<AlIntegrationConnection> {

        return this.client.put<AlIntegrationConnection>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            account_id: accountId,
            path: `/connections/${connectionId}`,
            params: {
                dry_run: dryRun
            },
            data: payload
        });
    }

    /**
     * Delete existing integration connection
     * DELETE
     * /v1/{account_id}/connections/{id}
     *
     * @param accountId The AIMS Account ID
     * @param connectionId id
     * @returns just the status code
     *
     * @remarks
     */
    async deleteConnectionById(accountId: string, connectionId: string): Promise<void> {
        const result = await this.client.delete({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            account_id: accountId,
            path: `/connections/${connectionId}`
        });
        return result;
    }

    /**
     * Returns list of payload types
     * GET
     * /v1/payload_types
     * https://integrations.mdr.global.alertlogic.com
     *
     *  @remarks
     *
     * */
    async getPayloadTypes(): Promise<AlConnectorsPayloadTypes[]> {
        return this.client.get<AlConnectorsPayloadTypes[]>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            path: '/payload_types'
        });
    }


    /**
     * Returns a list of all connections targets for an account
     * GET
     * /v1/{account_id}/connection_targets
     * https://connectors.mdr.product.dev.alertlogic.com
     *
     *  @returns the list of connection targets
     *
     *  @remarks
     *
     * */
    async getConnectionTargets(accountId: string, params: {[key: string]: string} = {}): Promise<AlConnectionTargets[]> {
        return this.client.get<AlConnectionTargets[]>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            account_id: accountId,
            params: params,
            path: `/connection_targets`
        });
    }


    /**
     * Returns Get a list of supported connection targets
     * GET
     * /v1/connection_targets
     * https://connectors.mdr.product.dev.alertlogic.com
     *
     * @returns the List of Connection Target with forms
     *
     * @remarks
     *
     * */
    async getConnectionTargetsDefinitions(): Promise<AlConnectionTargetType[]> {
        return this.client.get<AlConnectionTargetType[]>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            path: `/connection_targets`
        });
    }

    /**
     * Returns Connection Target Information
     * GET
     * /v1/{account_id}/connection_targets/{id}
     * https://connectors.mdr.product.dev.alertlogic.com
     *
     * @param accountId account id
     * @param connectionTargetId connection id
     * @returns an existing connection target
     *
     * @remarks
     *
     * */
    async getConnectionTargetById(accountId: string, connectionTargetId: string): Promise<AlConnectionTargets> {
        return this.client.get<AlConnectionTargets>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            account_id: accountId,
            path: `/connection_targets/${connectionTargetId}`
        });
    }

    /**
     * Create a connection target
     * POST
     * /v1/{account_id}/connection_targets
     * https://connectors.mdr.product.dev.alertlogic.com
     *
     * @param accountId account id
     * @param payload connection target
     * @returns a promise with the new connection
     *
     * @remarks
     */
    async createConnectionTarget(accountId: string,
        payload: AlConnectionTargets ): Promise<AlConnectionTargets> {
        return this.client.post<AlConnectionTargets>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            account_id: accountId,
            path: `/connection_targets`,
            data: payload
        });
    }

    /**
     * Updates existing connection target
     * PUT
     * /v1/{account_id}/connection_targets/{id}
     * https://connectors.mdr.product.dev.alertlogic.com
     *
     * @param accountId account id
     * @param connectionTargetId connection id
     * @param payload
     * @returns a promise with the new connection
     *
     * @remarks
     */
    async updateConnectionTarget(accountId: string,
        connectionTargetId: string,
        payload: AlConnectionTargets): Promise<AlConnectionTargets> {

        return this.client.put<AlConnectionTargets>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            account_id: accountId,
            path: `/connection_targets/${connectionTargetId}`,
            data: payload
        });
    }

    /**
     * Deletes existing connection target
     * DELETE
     * /v1/{account_id}/connection_targets/{id}
     * https://connectors.mdr.product.dev.alertlogic.com
     *
     * @param accountId The AIMS Account ID
     * @param connectionTargetId connection id
     * @returns just the status code
     *
     * @remarks
     */
    async deleteConnectionTargetById(accountId: string, connectionTargetId: string) : Promise<void> {
        const result = await this.client.delete({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            account_id: accountId,
            path: `/connection_targets/${connectionTargetId}`
        });
        return result;
    }

    /**
     * Returns Get a list of supported connection targets
     * GET
     * /v1/{{accountId}}/definitions/connection_targets
     * https://connectors.mdr.product.dev.alertlogic.com
     *
     * @returns the List of Connection Target with forms
     *
     * @remarks
     *
     * */
    async getConnectionTargetsDefinitionsByAccountId(accountId: string): Promise<AlConnectionTargetType[]> {
        return this.client.get<AlConnectionTargetType[]>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            account_id: accountId,
            path: `/definitions/connection_targets`
        });
    }

}
