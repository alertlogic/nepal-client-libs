import {
    AlApiClient,
    AlDefaultClient,
} from '@al/core';
import {
    AlSuggestionsTemplateResponseV2,
    AlCreateSavedQueryParamsV2,
    AlSavedQueryV2
} from './types';

export class AlSuggestionsClientInstanceV2 {

    protected client: AlApiClient;
    protected serviceVersion = 'v2';
    protected serviceName = 'suggestions';

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
     * Create a Saved Query
     * POST
     * /suggestions/v2/:account_id/search
     * @remarks "https://console.account.product.dev.alertlogic.com/users/api/suggestions/index.html#api-Queries-CreateQuery"
     */
    createSavedQuery(accountId: string, savedQueryParams: AlCreateSavedQueryParamsV2) {
        return this.client.post<AlSavedQueryV2>({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: '/queries',
            data: savedQueryParams,
        });

    }

    /**
     * Get a Saved Query
     * GET
     * /suggestions/v2/:account_id/queries/:id
     * @remarks "https://console.account.product.dev.alertlogic.com/users/api/suggestions/index.html#api-Queries-GetQuery"
     */
    getQuery(accountId: string, queryId: string) {
        return this.client.get<AlSavedQueryV2>({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/queries/${queryId}`,
        });

    }
}
