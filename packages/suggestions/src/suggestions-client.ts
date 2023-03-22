/**
 * Module to deal with available Suggestions Public API endpoints
 */
import {
    AlDefaultClient,
    APIRequestParams,
    AlLocation,
} from '@al/core';
import {
    CreateSavedQueryParams,
    DescribeSearchRequest,
    DescribeSearchResponse,
    FetchGroupsQueryParams,
    FetchQueriesResponse,
    SavedGroup,
    SavedQuery,
    SearchCategory,
    SearchRule,
    SearchRulesResponse,
    SearchTemplate,
    SearchTemplatesResponse,
    SearchToken,
    SuggestionsRequestParams,
    SuggestSearchResponse,
    TranslateSearchRequest,
    TranslateSearchResponse,
    UpdateSavedQueryParams,
} from './types/al-suggestions.types-v1';

export class AlSuggestionsClientInstanceV1 {

    private client = AlDefaultClient;
    private serviceName = 'suggestions';

    /**
     * Create a saved query for the given account ID
     */
    async createSavedQuery(accountId: string, savedQueryParams: CreateSavedQueryParams): Promise<SavedQuery> {
        return this.client.post<SavedQuery>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: '/queries',
            data: savedQueryParams,
        });

    }

    /**
     * Get a saved query by account ID and query ID
     */
    async getQuery(accountId: string, queryId: string): Promise<SavedQuery> {
        return this.client.get<SavedQuery>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/queries/${queryId}`,
        });

    }

    /**
     * Get a list of saved queries for the given account ID
     */
    async getQueries(accountId: string, queryParams: { data_type?: string } = {}): Promise<SavedQuery[]> {
        const fetchRequestParams: APIRequestParams = {
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: '/queries',
            params: queryParams,
        };
        const response: FetchQueriesResponse = await this.client.get(fetchRequestParams);
        return response.queries;
    }

    /**
     * Update the saved query with the given ID. All body parameters are optional, but at least one should be given.
     */
    async updateQuery(accountId: string, queryId: string, queryUpdate: UpdateSavedQueryParams): Promise<SavedQuery> {
        return this.client.post<SavedQuery>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/queries/${queryId}`,
            data: queryUpdate,
        });

    }

    /**
     * Delete the saved query with the given ID.
     */
    deleteQuery(accountId: string, queryId: string): Promise<unknown> {
        return this.client.delete({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/queries/${queryId}`,
        });
    }

    /**
     * Get a list of search categories. If the ids parameter is passed with a CSV of IDs, the result is the set of categories identified by each ID in a categories array.
     * If no ids parameter is passed, returns all categories.
     */
    async getCategories(accountId: string, queryParams?: { ids: string[] }): Promise<SearchCategory[]> {
        const fetchRequestParams: APIRequestParams = {
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: '/categories',
        };
        if (queryParams) {
            fetchRequestParams.params = queryParams;
        }
        const categories = await this.client.get(fetchRequestParams);
        return categories as SearchCategory[];
    }

    /**
     * Get a search rule by rule ID
     */
    async getRule(accountId: string, ruleId: string, queryParams?: { include_categories: string }): Promise<SearchRule> {
        const fetchRequestParams: APIRequestParams = {
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/rules/${ruleId}`,
        };
        if (queryParams) {
            fetchRequestParams.params = queryParams;
        }
        const rule = await this.client.get(fetchRequestParams);
        return rule as SearchRule;
    }

    /**
     * Get a list of search rules. If the ids parameter is passed with a CSV of IDs, the result is the set of rules identified by each ID in a rules array.
     * If no ids parameter is passed, returns all rules
     */
    getRules(accountId: string, queryParams?: { ids?: string, include_categories?: boolean }): Promise<SearchRule[]> {
        const fetchRequestParams: APIRequestParams = {
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: '/rules',
        };
        if (queryParams) {
            fetchRequestParams.params = queryParams;
        }
        return this.client.get(fetchRequestParams)
            .then((response: SearchRulesResponse) => response.rules);
    }

    /**
     * Get a list of search tokens. If the ids parameter is passed with a CSV of IDs, the result is the set of tokens identified by each ID in a tokens array.
     * If no ids parameter is passed, returns all rules
     */
    async getTokens(accountId: string, queryParams?: { ids?: string }): Promise<SearchToken[]> {
        const fetchRequestParams: APIRequestParams = {
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: '/tokens',
        };
        if (queryParams) {
            fetchRequestParams.params = queryParams;
        }
        const tokens = await this.client.get(fetchRequestParams);
        return tokens as SearchToken[];
    }

    /**
     * This hints suggestions to preload and index the data sets for the given account_id. If the data for this account is already in the cache, nothing is done
     */
    precache(accountId: string): Promise<void> {
        return this.client.get({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: '/precache',
        });
    }

    /**
     * Provides suggestions for the search filters of all displayable fields (depending on how it is called).
     */
    async suggest(accountId: string, dataType: string = 'logmsgs', requestParams: SuggestionsRequestParams): Promise<SuggestSearchResponse> {
        return this.client.post<SuggestSearchResponse>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/suggest/${dataType}`,
            data: requestParams,
        });

    }

    /**
     * This endpoint takes an entire search request  and rewrites it so that the descriptor fields (field_descriptors array and display attributes on some id fields) have been added or updated.
     * Additionally, this performs syntactic and semantic validation of the query
     */
    async describe(accountId: string, dataType: string = 'logmsgs', searchRequest: DescribeSearchRequest): Promise<DescribeSearchResponse> {
        return this.client.post<DescribeSearchResponse>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/describe/${dataType}`,
            data: searchRequest,
        });

    }

    /**
     * The translate endpoint behaves similarly to describe, taking the same input, performing the same
     * validation and producing a similar output, .except the resulting query in search_request is returned in the
     * format suitable for input to the search API
     * Specifically, JSON body of the request to the search API is returned in the search_request key of the response.
     */
    async translate(accountId: string, dataType: string = 'logmsgs', searchRequest: TranslateSearchRequest): Promise<TranslateSearchResponse> {
        return this.client.post<TranslateSearchResponse>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/translate/${dataType}`,
            data: searchRequest,
        });

    }

    /**
     * Get a list of search templates for the given account ID. By default, the list will include search templates in accounts that have a managed relationship to account_id given in the URL
     * This behavior can be disabled by setting include_managing_account_templates to false, in which case the response will exclusively contain templates for the account_id given in the URL.
     */
    getSearchTemplates(accountId: string, queryParams: { type?: string } = {}): Promise<SearchTemplatesResponse> {
        return this.client.get({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: '/templates',
            params: queryParams,
        });
    }

    /**
     * Get a search template by account ID and template ID.
     */
    getSearchTemplate(accountId: string, templateId: string): Promise<SearchTemplate> {
        return this.client.get({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/templates/${templateId}`,
        });
    }

    /**
     * Create a search template for the given account ID.
     */
    createSearchTemplate(accountId: string, template: SearchTemplate): Promise<SearchTemplate> {
        return this.client.post({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: '/templates',
            data: template,
        });
    }

    /**
     * Update the search template with the given ID. All body parameters are optional, but at least one should be given.
     */
    async updateSearchTemplate(accountId: string, templateId: string, template: SearchTemplate): Promise<any> {
        return this.client.post({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/templates/${templateId}`,
            data: template,
        });
    }

    /**
     * Delete the search template with the given ID.
     * A search template must be soft-deleted (set to "deleted": true) prior to being permanently deleted.
     * Attempting to delete a search template set to "deleted": false will result in a 400 Bad Request error.
     */
    async deleteSearchTemplate(accountId: string, templateId: string): Promise<unknown> {
        return await this.client.delete({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/templates/${templateId}`,
        });
    }

    /**
     * Get a group by account ID, object type, and group ID.
     */
    async getGroup(
        accountId: string,
        objectType: 'queries' | 'templates',
        groupId: string,
        queryParams: FetchGroupsQueryParams = {},
    ): Promise<SavedGroup> {
        return this.client.get({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/groups/${objectType}/${groupId}`,
            params: queryParams,
        });
    }

    /**
     * Get a list of all groups (by object type) for the given account ID.
     */
    async getGroups(
        accountId: string,
        objectType: 'queries' | 'templates',
        queryParams: FetchGroupsQueryParams = {},
    ): Promise<{ groups: SavedGroup[]; templates?: SearchTemplate[]; queries?: SavedQuery[] }> {
        return this.client.get({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/groups/${objectType}`,
            params: queryParams,
        });

    }

    /**
     * Groups can be used to organize saved queries and search templates. Groups are associated with a specific object type, either queries or templates.
     * A group can be parented to another group of the same type to create nested groups, and objects (queries or templates) can be associated to groups by setting their group_id property
     */
    async createGroup(accountId: string, objectType: 'queries' | 'templates', group: SavedGroup): Promise<SavedGroup> {
        return this.client.post({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/groups/${objectType}`,
            data: group,
        });
    }

    /**
     * Update a group. Groups are associated with a specific object type, either queries or templates.
     * All body parameters are optional, but at least one must be given.
     */
    async updateGroup(
        accountId: string,
        objectType: 'queries' | 'templates',
        groupId: string,
        group: SavedGroup,
    ): Promise<any> {
        return await this.client.post({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/groups/${objectType}/${groupId}`,
            data: group,
        });
    }

    /**
     * Permanently delete a group. A group must be soft-deleted (set to "deleted": true) prior to being permanently deleted.
     * Attempting to delete a group set to "deleted": false will result in a 400 Bad Request error.
     * If a group is permanently deleted, all child groups and all associated objects (templates or saved queries) will be permanently deleted as well.
     */
    async deleteGroup(accountId: string, objectType: 'queries' | 'templates', groupId: string): Promise<void> {
        return this.client.delete({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/groups/${objectType}/${groupId}`,
        });
    }
}
