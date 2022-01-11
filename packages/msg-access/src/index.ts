import { AlGlobalizer } from '@al/core';
import { AlMsgAccessClientInstance } from './msg-access-client';

export * from './msg-access-client';
/* tslint:disable:variable-name */
export const AlMsgAccessClient = AlGlobalizer.instantiate( "AlMsgAccessClient", () => new AlMsgAccessClientInstance() );
