import { AlGlobalizer } from '@al/core';
import { AlTicketMasterClientInstance } from './al-ticketmaster-client';

export * from './al-ticketmaster-client';
/* tslint:disable:variable-name */
export const AlTicketMasterClient = AlGlobalizer.instantiate( "AlTicketMasterClient", () => new AlTicketMasterClientInstance() );
