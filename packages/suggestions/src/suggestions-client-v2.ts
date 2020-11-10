import {
    AlApiClient,
    AlDefaultClient,
    AlLocation,
} from '@al/core';
import {
    AlCreateQueryTemplateV2,
    AlEnumeratedFieldV2,
    AlSuggestionsTemplateResponseV2,
    AlUpdateQueryTemplateV2,
    AlCreateSavedQueryParamsV2,
    AlSavedQueryV2,
    AlUpdateSavedQueryParamsV2,
    AlPropertyValuesV2,
    ValidPropertiesV2,
    AlSavedQueriesV2
} from './types';

export class AlSuggestionsClientInstanceV2 {

    protected client: AlApiClient;
    protected serviceVersion = 'v2';
    protected serviceName = 'suggestions';

    constructor(client: AlApiClient = null) {
        this.client = client || AlDefaultClient;
    }

    /**
     * Create a Template
     * POST
     * /suggestions/v2/:account_id/templates
     * @remarks "https://console.account.product.dev.alertlogic.com/users/api/suggestions/index.html#api-Templates_V2-CreateTemplate"
     */
    createQueryTemplate(accountId: string, queryTemplate: AlCreateQueryTemplateV2): Promise<AlSuggestionsTemplateResponseV2> {
        return this.client.post<AlSuggestionsTemplateResponseV2>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: '/templates',
            data: queryTemplate,
        });
    }

    /**
     * Delete Template Query with the given uuid
     * DELETE
     * /suggestions/v2/:account_id/templates/:id
     * @remarks "https://console.account.product.dev.alertlogic.com/users/api/suggestions/index.html#api-Templates_V2-DeleteTemplate"
     */
    deleteQueryTemplate(accountId: string, queryId: string) {
        return this.client.delete({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/templates/${queryId}`,
        });
    }

    /**
     * Get Templates
     * GET
     * /suggestions/v2/:account_id/templates
     * @remarks "https://console.account.product.dev.alertlogic.com/users/api/suggestions/index.html#api-Templates-GetTemplates"
     */
    async getQueryTemplates(accountId:string, params?:{ deleted?:boolean,data_type?:string }):Promise<AlSuggestionsTemplateResponseV2[]> {
        const result = await this.client.get({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: '/templates',
            params: params,
        });
        return result.templates as AlSuggestionsTemplateResponseV2[];
    }

    /**
     * Get Template
     * GET
     * /suggestions/v2/:account_id/templates/:id
     * @remarks "https://console.account.product.dev.alertlogic.com/users/api/suggestions/index.html#api-Templates-GetTemplate"
     */
    getQueryTemplate(accountId:string, params?:{ deleted?:boolean,data_type?:string }):Promise<AlSuggestionsTemplateResponseV2> {
        return this.client.get<AlSuggestionsTemplateResponseV2>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: '/templates',
            params: params,
        });
    }

    /**
     * Update a Template
     * POST
     * /suggestions/v2/:account_id/templates/:id
     * @remarks "https://console.account.product.dev.alertlogic.com/users/api/suggestions/index.html#api-Templates-UpdateTemplate"
     */
    updateQueryTemplate(accountId: string, queryId: string, queryTemplate: AlUpdateQueryTemplateV2): Promise<AlSuggestionsTemplateResponseV2> {
        return this.client.post<AlSuggestionsTemplateResponseV2>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/templates/${queryId}`,
            data: queryTemplate,
        });
    }

    /**
     * Create a Saved Query
     * POST
     * /suggestions/v2/:account_id/search
     * @remarks "https://console.account.product.dev.alertlogic.com/users/api/suggestions/index.html#api-Queries_V2-CreateQuery"
     */
    createSavedQuery(accountId: string, savedQueryParams: AlCreateSavedQueryParamsV2): Promise<AlSavedQueryV2> {
        return this.client.post<AlSavedQueryV2>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: '/queries',
            data: savedQueryParams,
        });
    }

    /**
     * Delete Saved Query with the given uuid
     * DELETE
     * /suggestions/v2/:account_id/queries/:id
     * @remarks "https://console.account.product.dev.alertlogic.com/users/api/suggestions/index.html#api-Queries_V2-GetQueries"
     */
    deleteSavedQuery(accountId: string, queryId: string) {
        return this.client.delete({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/queries/${queryId}`,
        });
    }

    /**
     * Get Property Values (list)
     * GET
     * /suggestions/v2/:account_id/queries/properties
     * @remarks "https://algithub.pd.alertlogic.net/pages/alertlogic/suggestions/api/index.html#api-Queries_V2-GetQueriesProperties"
     */
    async getPropertyValues(accountId: string, properties: ValidPropertiesV2[]): Promise<AlPropertyValuesV2> {
        const result = await this.client.get({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/queries/properties`,
            params: {properties: properties},
        });
        return result as AlPropertyValuesV2;
    }

    /**
     * Get a Saved Query
     * GET
     * /suggestions/v2/:account_id/queries/:id
     * @remarks "https://console.account.product.dev.alertlogic.com/users/api/suggestions/index.html#api-Queries_V2-GetQuery
     */
    getSavedQuery(accountId: string, queryId: string): Promise<AlSavedQueryV2> {
        return this.client.get<AlSavedQueryV2>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/queries/${queryId}`,
        });
    }

    /**
     * Get Saved Queries (list)
     * GET
     * /suggestions/v2/:account_id/queries/
     * @remarks "https://console.account.product.dev.alertlogic.com/users/api/suggestions/index.html#api-Queries_V2-GetQueries"
     */
    async getSavedQueries(accountId: string): Promise<AlSavedQueriesV2> {
        return this.client.get<AlSavedQueriesV2>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/queries`,
        });
    }

    /**
     * Update a Saved Query
     * PUT
     * /suggestions/v2/:account_id/search
     * @remarks "https://console.account.product.dev.alertlogic.com/users/api/suggestions/index.html#api-Queries_V2-CreateQuery"
     */
    updateSavedQuery(accountId: string, queryId: string, savedQueryParams: AlUpdateSavedQueryParamsV2): Promise<AlSavedQueryV2> {
        return this.client.post<AlSavedQueryV2>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/queries/${queryId}`,
            data: savedQueryParams,
        });
    }

    /**
     * Retrieve an enumeration of fields for a given datatype and filter string (optional, although the use value
     * of this method without it is questionable.
     *
     * The special parameter `applyMagic` will submit the resulting array to a heuristic sorting algorithm design
     * to bubble more meaningful suggestions to the top of the list.
     *
     * GET /suggestions/v2/:account_id/enumeration/:datatype/all_fields[?filter=foo]
     * @remarks "https://console.account.product.dev.alertlogic.com/users/api/suggestions/index.html#api-Enumeration"
     */
    public async enumerateFields( accountId:string,
                                  dataType:string,
                                  filter?:string,
                                  applyMagic?:boolean ):Promise<AlEnumeratedFieldV2[]> {
        let path = `/enumeration/${dataType}/all_fields`;
        let parameters:{[key:string]:string} = {};
        if ( filter ) {
            parameters.filter = filter;
        }
        let request = {
            path,
            params: parameters,
            account_id: accountId,
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
        };
        let response = await this.client.get( request );
        let fields = 'fields' in response ? response.fields : [];
        if ( filter && applyMagic ) {
            this.applyMagic( fields, filter );
        }
        return fields;
    }

    /**
     * Retrieves a single field by name
     *
     * GET /suggestions/v2/:account_id/enumeration/:datatype/all_fields
     */
    public async enumerateFieldByName( accountId:string,
                                       dataType:string,
                                       fieldName:string ):Promise<AlEnumeratedFieldV2> {
        let matches = await this.enumerateFields( accountId, dataType, fieldName );
        return matches.find( m => m.name === fieldName );
    }

    /**
     * Retrieves an enumeration of values for a given field
     *
     * GET /suggestions/v2/:account_id/enumeration/:datatype/:field
     * @remarks "https://console.account.product.dev.alertlogic.com/users/api/suggestions/index.html#api-Enumeration"
     */
    public async enumerateValues( accountId:string,
                                  dataType:string,
                                  field:string ):Promise<string[]> {
        let request = {
            account_id: accountId,
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/enumeration/${dataType}/values/${field}`
        };
        return this.client.get( request )
                    .then( response => `values` in response ? response.values : [] );
    }

    protected applyMagic( fields:AlEnumeratedFieldV2[], searchPhrase:string ) {
        let escapedSearchPhrase = searchPhrase.replace( /[-\/\\^$.()|[\]{}]/g, '\\$&' )
                                              .replace( /\*/g, "([a-z0-9_\\-\\.]+)" );
        let exactMatch = new RegExp( `^${escapedSearchPhrase}$`, 'i' );
        let startsWith = new RegExp( `^${escapedSearchPhrase}.*`, 'i' );
        let anyMatch = new RegExp( escapedSearchPhrase, 'i' );
        fields.forEach( field => {
            let w = 0;
            if ( exactMatch.test( field.name ) ) {
                w += 100;   //  perfect match should always bubble to the top
            } else if ( startsWith.test( field.name ) ) {
                w += 10;    //  fields that start with the phrase should be higher than those in which it appears interpolated
            } else if ( anyMatch.test( field.name ) || startsWith.test( field.label ) ) {
                w += 5;     //  fields with the filter anywhere or name or the beginning of the label
            } else if ( anyMatch.test( field.label ) ) {
                w += 2;     //  fields with the filter anywhere in the label
            } else {
                w -= 1;     //  description-only matches are presumably the least interesting
            }
            if ( field.has_values ) {
                w += 2;     //  presumably, fields with enumerated values will be more interesting than those without
            }
            field['w'] = w;
        } );
        fields.sort( ( a, b ) => b['w'] - a['w'] );
    }
}
