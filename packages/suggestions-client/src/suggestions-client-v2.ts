import {
    AlApiClient,
    AlDefaultClient,
    AlLocation,
} from '@al/core';
import {
    AlSuggestionsTemplateResponseV2
} from './types';
import { CreateSavedQueryParams, SavedQuery } from './suggestions-service.types';


export class AlSuggestionsClientV2 {

    private client: AlApiClient;
    private serviceVersion = 'v2';
    private serviceName = 'suggestions';

    constructor(client: AlApiClient = null) {
        this.client = client || AlDefaultClient;
    }

    /**
     * Get Templates
     * GET
     * /suggestions/v2/:account_id/templates
     * @remarks "https://api.product.dev.alertlogic.com/suggestions/v2/01000001/templates"
     */
    getTemplates( accountId:string, params?:{ deleted?:boolean,data_type?:string } ):Promise<[AlSuggestionsTemplateResponseV2]> {
        return this.client.get<[AlSuggestionsTemplateResponseV2]>({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: '/templates',
            params: params,
        });
    }


    /**
     * Create a saved query for the given account ID
     */
    async createSavedQuery(accountId: string, savedQueryParams: CreateSavedQueryParams) {
        return this.client.post<SavedQuery>({
            service_name: this.serviceName,
            account_id: accountId,
            path: '/queries',
            data: savedQueryParams,
        });

    }
}
