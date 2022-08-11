import { AlGlobalizer } from '@al/core';
import { AlWatchlistClientInstance } from './watchlist-client';

export * from './watchlist-client';
export * from './types';
/* tslint:disable:variable-name */
export const AlWhoisClient = AlGlobalizer.instantiate( "AlWatchlistClient", () => new AlWatchlistClientInstance() );
