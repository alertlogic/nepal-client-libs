/**
 * Module to deal with available Suggestions Public API endpoints
 */
import { ALClient, APIRequestParams } from '@al/client';
import {
  CreateSavedQueryParams,
  UpdateSavedQueryParams,
  SavedQuery,
  FetchQueriesResponse,
  SearchCategory,
  SearchRule,
  SearchToken,
  SearchRulesResponse,
  SuggestionsRequestParams,
  SuggestSearchResponse,
  DescribeSearchResponse,
  TranslateSearchRequest,
  DescribeSearchRequest,
  TranslateSearchResponse,
  SearchTemplate,
  SearchTemplatesResponse,
} from './suggestions-service.types';

class SuggestionsClient {

  private alClient = ALClient;
  private serviceName = 'suggestions';
  /**
   * Create a saved query for the given account ID
   */
  async createSavedQuery(accountId: string, savedQueryParams: CreateSavedQueryParams) {
    const create = await this.alClient.post({
      service_name: this.serviceName,
      account_id: accountId,
      path: '/queries',
      data: savedQueryParams,
    });
    return create as SavedQuery;
  }
  /**
   * Get a saved query by account ID and query ID
   */
  async getQuery(accountId: string, queryId: string) {
    const query = await this.alClient.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/queries/${queryId}`,
    });
    return query as SavedQuery;
  }
  /**
   * Get a list of saved queries for the given account ID
   */
  async getQueries(accountId: string, queryParams: {data_type?: string} = {}) {
    const fetchRequestParams: APIRequestParams = {
      service_name: this.serviceName,
      account_id: accountId,
      path: '/queries',
      params: queryParams,
    };
    const queries = await this.alClient.fetch(fetchRequestParams)
      .then((response: FetchQueriesResponse) => response.queries);
    return queries;
  }
  /**
   * Update the saved query with the given ID. All body parameters are optional, but at least one should be given.
   */
  async updateQuery(accountId: string, queryId: string, queryUpdate: UpdateSavedQueryParams) {
    const query = await this.alClient.post({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/queries/${queryId}`,
      data: queryUpdate,
    });
    return query as SavedQuery;
  }
  /**
   * Delete the saved query with the given ID.
   */
  async deleteQuery(accountId: string, queryId: string) {
    const deleteQuery = await this.alClient.delete({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/queries/${queryId}`,
    });
    return deleteQuery;
  }
  /**
   * Get a list of search categories. If the ids parameter is passed with a CSV of IDs, the result is the set of categories identified by each ID in a categories array.
   * If no ids parameter is passed, returns all categories.
   */
  async getCategories(accountId: string, queryParams?: {ids: string[]}) {
    const fetchRequestParams: APIRequestParams = {
      service_name: this.serviceName,
      account_id: accountId,
      path: '/categories',
    };
    if (queryParams) {
      fetchRequestParams.params = queryParams;
    }
    const categories = await this.alClient.fetch(fetchRequestParams);
    return categories as SearchCategory[];
  }
  /**
   * Get a search rule by rule ID
   */
  async getRule(accountId: string, ruleId: string, queryParams?: {include_categories: string}) {
    const fetchRequestParams: APIRequestParams = {
      service_name: this.serviceName,
      account_id: accountId,
      path: `/rules/${ruleId}`,
    };
    if (queryParams) {
      fetchRequestParams.params = queryParams;
    }
    const rule = await this.alClient.fetch(fetchRequestParams);
    return rule as SearchRule;
  }
  /**
   * Get a list of search rules. If the ids parameter is passed with a CSV of IDs, the result is the set of rules identified by each ID in a rules array.
   * If no ids parameter is passed, returns all rules
   */
  async getRules(accountId: string, queryParams?: {ids?: string, include_categories?: boolean}) {
    const fetchRequestParams: APIRequestParams = {
      service_name: this.serviceName,
      account_id: accountId,
      path: '/rules',
    };
    if (queryParams) {
      fetchRequestParams.params = queryParams;
    }
    const rules = await this.alClient.fetch(fetchRequestParams)
      .then((response: SearchRulesResponse) => response.rules);
    return rules;
  }
  /**
   * Get a list of search tokens. If the ids parameter is passed with a CSV of IDs, the result is the set of tokens identified by each ID in a tokens array.
   * If no ids parameter is passed, returns all rules
   */
  async getTokens(accountId: string, queryParams?: {ids?: string}) {
    const fetchRequestParams: APIRequestParams = {
      service_name: this.serviceName,
      account_id: accountId,
      path: '/tokens',
    };
    if (queryParams) {
      fetchRequestParams.params = queryParams;
    }
    const tokens = await this.alClient.fetch(fetchRequestParams);
    return tokens as SearchToken[];
  }
  /**
   * This hints suggestions to preload and index the data sets for the given account_id. If the data for this account is already in the cache, nothing is done
   */
  async precache(accountId: string) {
    const precache = await this.alClient.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: '/precache',
    });
    return precache;
  }
  /**
   * Provides suggestions for the search filters of all displayable fields (depending on how it is called).
   */
  async suggest(accountId: string, dataType: string = 'logmsgs', requestParams: SuggestionsRequestParams) {
    const suggest = await this.alClient.post({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/suggest/${dataType}`,
      data: requestParams,
    });
    return suggest as SuggestSearchResponse;
  }
  /**
   * This endpoint takes an entire search request  and rewrites it so that the descriptor fields (field_descriptors array and display attributes on some id fields) have been added or updated.
   * Additionally, this performs syntactic and semantic validation of the query
   */
  async describe(accountId: string, dataType: string = 'logmsgs', searchRequest: DescribeSearchRequest) {
    const describe = await this.alClient.post({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/describe/${dataType}`,
      data: searchRequest,
    });
    return describe as DescribeSearchResponse;
  }
  /**
   * The translate endpoint behaves similarly to describe, taking the same input, performing the same validation and producing a similar output, .except the resulting query in search_request is returned in the format suitable for input to the search API
   * Specifically, JSON body of the request to the search API is returned in the search_request key of the response.
   */
  async translate(accountId: string, dataType: string = 'logmsgs', searchRequest: TranslateSearchRequest) {
    const describe = await this.alClient.post({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/translate/${dataType}`,
      data: searchRequest,
    });
    return describe as TranslateSearchResponse;
  }

  async getSearchTemplates(accountId: string, queryParams: {type?: string} = {}) {
    const template = await this.alClient.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: '/templates',
      params: queryParams,
    });
    return template as SearchTemplatesResponse;
  }

  async getSearchTemplate(accountId: string, templateId: string) {
    const template = await this.alClient.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/templates/${templateId}`,
    });
    return template as SearchTemplate;
  }

  async createSearchTemplate(accountId: string, template: SearchTemplate) {
    const createTemplate = await this.alClient.post({
      service_name: this.serviceName,
      account_id: accountId,
      path: '/templates',
      data: template,
    });
    return createTemplate as SearchTemplate;
  }

  async updateSearchTemplate(accountId: string, templateId: string, template: SearchTemplate) {
    const updateTemplate = await this.alClient.set({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/templates/${templateId}`,
      data: template,
    });
    return updateTemplate;
  }

  async deleteSearchTemplate(accountId: string, templateId: string) {
    const deleteTemplate = await this.alClient.delete({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/templates/${templateId}`,
    });
    return deleteTemplate;
  }
}

export const suggestionsClient = new SuggestionsClient();
