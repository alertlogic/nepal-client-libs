import { AlGlobalizer } from '@al/core';

import { AlExclusionsClientInstance } from './al-exclusions-client';

export * from './al-exclusions-client';
export * from './types';
/* tslint:disable:variable-name */
export const AlExclusionsClient = AlGlobalizer.instantiate( "AlExclusionsClient", () => new AlExclusionsClientInstance() );
