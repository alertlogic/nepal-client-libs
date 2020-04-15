import { AlGlobalizer } from '@al/common';
import { AlIngestClientInstance } from './al-ingest-client';

export * from './al-ingest-client';

/* tslint:disable:variable-name */
export const AlIngestClient = AlGlobalizer.instantiate( "AlIngestClient", () => new AlIngestClientInstance() );
