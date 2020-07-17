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
} from './types';

export class AlIntegrationsClientInstance {

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
    async getIntegrationTypes() {
        return this.client.get<AlIntegrationType[]>({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            path: '/integration_types'
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
    async getIntegrationTypeByName(name:string) {
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
    async getConnections(accountId: string, params?: {include_sample_payload: boolean}) {
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
    async getConnectionById(accountId: string, connectionId: string) {
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
    async deleteConnectionById(accountId: string, connectionId: string) {
        const result = await this.client.delete({
            version: this.serviceVersion,
            service_stack: this.serviceStack,
            account_id: accountId,
            path: `/connections/${connectionId}`
        });
        return result;
    }

}
