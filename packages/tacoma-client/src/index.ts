import { AlGlobalizer } from '@al/core';
import { AlTacomaClientInstance } from './al-tacoma-client';

export * from './types';
export * from './al-tacoma-client';

/* tslint:disable:variable-name */
export const ALTacoma = AlGlobalizer.instantiate("al.tacoma", () => new AlTacomaClientInstance() );
