export interface CreateSavedQueryParams {
  group_id: string;
  name: string;
  data_type: string;
  search_request: any;
}

export interface UpdateSavedQueryParams {
  data_type?: string;
  group_id?: string;
  name?: string;
  search_request?: any;
  deleted?: boolean;
}

export interface SavedQuery {
  id: string;
  account_id: string;
  group_id:string;
  name:string;
  description?: string;
  data_type:string;
  search_request: any;
  deleted?: boolean;
}

export interface FetchQueriesResponse {
  queries: SavedQuery[];
}

export interface SearchCategory {
  id: string;
  name: string;
}

export interface SearchRule {
  id: string;
  name: string;
  patterns: {
    id: string;
    pattern: string;
  }[];
  properties: {
    id: string;
    values: string[];
  }[];
  tokens: string[];
  categories?: SearchCategory[];
}

export interface SearchRulesResponse {
  rules: SearchRule[];
}

export interface SearchToken {
  id: string;
  desc: string;
  name: string;
  parent: string;
  type: string;
}

export interface SuggestionNamespaceSpecification {
  ns: string;
  max_names?: number;
}

export interface SuggestValueSpecification {
  field: SuggestedFieldSpecification;
  max_values?: string;
  max_names?: string;
}

export interface SuggestedFieldSpecification {
  ns: string;
  id: string;
}

export interface SuggestionQueryGlobalOptions {
  exclude_filter_names?: boolean;
  exclude_filter_values?: boolean;
  exclude_id_names?: boolean;
  exclude_unused_entries?: boolean;
}

export interface SuggestionsRequestParams {
  subject?: string;
  suggest_names?: SuggestionNamespaceSpecification[];
  suggest_values?: SuggestValueSpecification[];
  options?: SuggestionQueryGlobalOptions;
  filter?: any;
}

export interface SuggestedFieldDescriptor {
  aggregators?: string[];
  array?: boolean;
  depends_on?: SuggestedFieldSpecification[];
  displayable?: boolean;
  groupable?: boolean;
  name?: string;
  operators?: string[];
  id?: SuggestedFieldSpecification;
  path?: string;
  search_name?: string;
  searchable: boolean;
  sortable?: boolean;
  type: string;
}

export interface SuggestedTermValue {
  value: string;
  display: string;
}

export interface SuggestedTerm {
  field: SuggestedFieldSpecification;
  field_descriptor: SuggestedFieldDescriptor;
  values: (SuggestedTermValue | string | number)[];
}

export interface TimeRangeSpecification {
  end_timestamp?: number;
  start_timestamp?: number;
  timespan?: number;
}

// TODO - Revisit the types of these below!
export interface SuggestionsSearchQuery {
  select: any;
  where: any;
  order_by?: any;
  group_by?: any;
  having?: any;
  limit?: number;
  time_range?: any;
}

export interface SuggestSearchResponse {
  suggested_terms: SuggestedTerm[];
}

export interface DescribeSearchError {
  error_type: string;
  error_text: string;
  attribute?: string;
  field?: string;
  operator?: string;
  value?: string;
}

export interface DescribeSearchResponse {
  search_request: {
    field_descriptors: SuggestedFieldDescriptor[];
  };
  errors?: DescribeSearchError[];
  selected_fields?: string[]|{field: string, label: string}[];
}

export interface DescribeSearchRequest {
  search_request: SuggestionsSearchQuery;
}

export interface TranslateSearchRequest {
  response_format?: 'search';
  search_request: SuggestionsSearchQuery;
}

export interface TranslateSearchResponse {
  response_format: string;
  search_request: {
    field_descriptors: SuggestedFieldDescriptor[];
  };
  errors: DescribeSearchError[];
}

interface UserTimeStamp {
  at?: number;
  by?: string;
}

export interface SearchTemplate {
  id?: string;
  name?: string;
  account_id?: string;
  data_type?: string;
  description?: string;
  group_id?: string;
  search_request?: any;
  deleted?: boolean;
  created?: UserTimeStamp;
  modified?: UserTimeStamp;
}

export interface SearchTemplatesResponse {
  templates: SearchTemplate[];
}

export interface FetchGroupsQueryParams {
  deleted?: boolean;
  include_object?: boolean;
  include_child_groups?: boolean;
  data_type?: string;
  view_type?: string;
  include_managing_account_groups?: boolean;
}

export interface SavedGroup {
  id?: string;
  account_id?: string;
  parent_id?: string;
  name?: string;
  description?: string;
  deleted?: boolean;
  groups?: SavedGroup[];
  templates?: SearchTemplate[];
  queries?: SavedQuery[];
  created?: UserTimeStamp;
  modified?: UserTimeStamp;
}
