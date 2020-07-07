import { AlGlobalizer } from '@al/core';
import { AlSuggestionsClientInstanceV2 } from './suggestions-client-v2';

/* tslint:disable:variable-name */
export const AlSuggestionsClientV2 = AlGlobalizer.instantiate( "AlSuggestionsClientV2", () => new AlSuggestionsClientInstanceV2() );
export { suggestionsClient as SuggestionsClient } from './suggestions-client';
/* tslint:enable:variable-name */

export * from './suggestions-client-v2';
export * from './types';
export {
  CreateSavedQueryParams,
  UpdateSavedQueryParams,
  SavedQuery,
  SearchCategory,
  FetchQueriesResponse,
  SearchRule,
  SearchToken,
  SearchRulesResponse,
  SuggestionNamespaceSpecification,
  SuggestValueSpecification,
  SuggestedFieldSpecification,
  SuggestedFieldDescriptor,
  SuggestionQueryGlobalOptions,
  SuggestionsRequestParams,
  SuggestSearchResponse,
  SuggestedTerm,
  SuggestedTermValue,
  SuggestionsSearchQuery,
  DescribeSearchRequest,
  DescribeSearchResponse,
  TranslateSearchRequest,
  TranslateSearchResponse,
  SearchTemplate,
  SearchTemplatesResponse,
  FetchGroupsQueryParams,
  SavedGroup,
} from './suggestions-service.types';
