/**
 * Module to deal with available Analytic Engine's Tuner Public API endpoints
 */
import {
    AlApiClient,
    AlDefaultClient,
    AlLocation,
} from '@al/core';
import {
    AnalyticHandlingUpdateObject,
    AnalyticInfo,
    AnalyticListReturn,
    AnalyticUpdateObject,
    HandlingSettings,
    IncidentTypeInfo
} from "./types";

export class AlAETunerClientInstance {

    constructor(public client: AlApiClient = AlDefaultClient) {
    }

    /**
     * List Analytics for a given account
     * @param accountId
     * @param datatype Data type used for analytics generation. If this parameter omitted, analytics for all data types are returned.
     * @param output What to include in the response.
     */
    async getAnalytics(accountId: string, datatype?: string, output?: string):Promise<AnalyticListReturn> {
        let params: { datatype?: string, output?: string } = {};
        if (datatype) {
            params.datatype = datatype;
        }
        if (output) {
            params.output = output;
        }
        return this.client.get<AnalyticListReturn>({
            service_stack: AlLocation.AETunerAPI,
            account_id: accountId,
            version: 'v1',
            path: `/analytics`,
            params,
        });
    }

    /**
     * Returns an analytic for a specific customer
     * @param accountId
     * @param analytic Analytic Fully Qualified Name
     */
    async getAnalytic(accountId: string, analytic: string):Promise<AnalyticInfo> {
        return this.client.get<AnalyticInfo>({
            service_stack: AlLocation.AETunerAPI,
            account_id: accountId,
            version: 'v1',
            path: `/analytics/${analytic}`
        });
    }

    /**
     * Update an analytic
     * @param accountId
     * @param update
     * @param analytic Analytic Fully Qualified Name
     */
    async updateAnalytic(accountId: string, update: AnalyticUpdateObject, analytic: string):Promise<unknown> {
        return this.client.post<unknown>({
            service_stack: AlLocation.AETunerAPI,
            account_id: accountId,
            version: 'v1',
            path: `/analytics/${analytic}`,
            params: update
        });
    }

    /**
     * List all incident types for a specific customer
     * @param accountId
     */
    async listIncidentTypes(accountId: string):Promise<string[]> {
        return this.client.get<string[]>({
            service_stack: AlLocation.AETunerAPI,
            account_id: accountId,
            version: 'v1',
            path: `/incident_types`
        });
    }

    /**
     * Return incident type for a specific customer by it's name
     * @param accountId
     * @param incidentType Incident Type Fully Qualified Name
     */
    async getIncidentType(accountId: string, incidentType: string):Promise<IncidentTypeInfo> {
        return this.client.get<IncidentTypeInfo>({
            service_stack: AlLocation.AETunerAPI,
            account_id: accountId,
            version: 'v1',
            path: `/incident_types/${incidentType}`
        });
    }

    /**
     *
     * @param accountId
     * @param update
     * @param incidentType Incident Type Fully Qualified Name
     */
    async updateIncidentType(accountId, update: AnalyticUpdateObject, incidentType: string):Promise<unknown> {
        return this.client.post<unknown>({
            service_stack: AlLocation.AETunerAPI,
            account_id: accountId,
            version: 'v1',
            path: `/incident_types/${incidentType}`,
            params: update
        });
    }


    /**
     * Returns a list of all incident handling settings for a given customer
     * @param accountId
     */
    async listIncidentHandling(accountId: string):Promise<HandlingSettings[]> {
        return this.client.get<HandlingSettings[]>({
            service_stack: AlLocation.AETunerAPI,
            account_id: accountId,
            version: 'v1',
            path: `/incident_handling`
        });
    }

    /**
     * Return incident type handling setting
     * @param accountId
     * @param incidentType Incident Type Fully Qualified Name
     */
    async getIncidentHandling(accountId: string, incidentType: string):Promise<HandlingSettings> {
        return this.client.get<HandlingSettings>({
            service_stack: AlLocation.AETunerAPI,
            account_id: accountId,
            version: 'v1',
            path: `/incident_handling/${incidentType}`
        });
    }

    /**
     * Set Incident Type handling setting
     * @param accountId
     * @param update
     * @param incidentType Incident Type Fully Qualified Name
     *
     * @returns Object with a `stored` key and a UUID value.
     */
    async updateIncidentHandling(accountId: string, update: AnalyticHandlingUpdateObject, incidentType: string):Promise<{stored: string}> {
        return this.client.post<{stored: string}>({
            service_stack: AlLocation.AETunerAPI,
            account_id: accountId,
            version: 'v1',
            path: `/incident_handling/${incidentType}`,
            params: update
        });
    }

    /**
     * Delete Incident Handling setting
     * @param accountId
     * @param reason
     * @param incidentType Incident Type Fully Qualified Name
     */
    async deleteIncidentHandling( accountId: string, reason: string, incidentType: string):Promise<{stored: string}> {
        return this.client.post<{stored: string}>({
            service_stack: AlLocation.AETunerAPI,
            account_id: accountId,
            version: 'v1',
            path: `/incident_handling/${incidentType}`,
            params: { reason }
        });
    }

}
