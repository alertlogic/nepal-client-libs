import {
    AlApiClient,
    AlDefaultClient,
    AlLocation,
} from '@al/core';
import {
    AlSuggestionsTemplateResponseV2,
    AlCreateSavedQueryParamsV2,
    AlSavedQueryV2
} from './types';

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
    async getTemplates( accountId:string, params?:{ deleted?:boolean,data_type?:string } ):Promise<AlSuggestionsTemplateResponseV2[]> {
        const result = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: '/templates',
            params: params,
        });
        return result.templates as AlSuggestionsTemplateResponseV2[];
    }


    /**
     * Create a saved query for the given account ID
     */
    createSavedQuery(accountId: string, savedQueryParams: AlCreateSavedQueryParamsV2) {
        return this.client.post<AlSavedQueryV2>({
            service_name: this.serviceName,
            account_id: accountId,
            path: '/queries',
            data: savedQueryParams,
        });

    }
}
