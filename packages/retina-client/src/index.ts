import { AlGlobalizer } from '@al/core';
import { AlRetinaClientInstance } from './al-retina-client';

/* tslint:disable:variable-name */
export const AlRetinaClient = AlGlobalizer.instantiate( "al.retina", () => new AlRetinaClientInstance() );

export { AlRetinaClientInstance } from './al-retina-client';
export * from './types';
