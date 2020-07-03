import {
    AlApiClient,
    AlDefaultClient,
    AlLocation,
} from '@al/core';
import {
    GetTemplatesQueryParams,
    AlSuggestionsTemplatesListResponseV2
} from './types';


export class SuggestionsClientV2 {

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
     * "https://api.product.dev.alertlogic.com/suggestions/v2/01000001/templates"
     */
    getTemplates( accountId:string, params:GetTemplatesQueryParams = null ):Promise<AlSuggestionsTemplatesListResponseV2> {
        return this.client.get<AlSuggestionsTemplatesListResponseV2>({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: '/templates',
            params: params,
        });
    }
}
