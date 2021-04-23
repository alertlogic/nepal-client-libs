import { AlGlobalizer } from '@al/core';
import { AlwsWhitelistClientInstance } from './al-whitelist-client';

/* tslint:disable:variable-name */
export const AlWhitelistClient = AlGlobalizer.instantiate('al.whitelist', () => new AlwsWhitelistClientInstance());

export { AlwsWhitelistClientInstance } from './al-whitelist-client';
export * from './types';
