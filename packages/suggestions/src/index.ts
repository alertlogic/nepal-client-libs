import { AlGlobalizer } from '@al/core';
import { AlSuggestionsClientInstanceV2 } from './suggestions-client-v2';
import { AlSuggestionsClientInstanceV1 } from './suggestions-client';

/* tslint:disable:variable-name */
export const AlSuggestionsClientV2 = AlGlobalizer.instantiate( "AlSuggestionsClientV2", () => new AlSuggestionsClientInstanceV2() );
export const SuggestionsClient = AlGlobalizer.instantiate( "SuggestionsClient", () => new AlSuggestionsClientInstanceV1() );
/* tslint:enable:variable-name */

export * from './suggestions-client-v2';
export * from './types';
