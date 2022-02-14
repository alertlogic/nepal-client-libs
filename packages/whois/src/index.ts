import { AlGlobalizer } from '@al/core';
import { AlWhoisClientInstance } from './whois-client';

export * from './whois-client';
/* tslint:disable:variable-name */
export const AlWhoisClient = AlGlobalizer.instantiate( "AlWhoisClient", () => new AlWhoisClientInstance() );
