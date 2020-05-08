/**
 * Module to deal with available Correlations Public API endpoints
 */
import {
  AlDefaultClient
} from '@al/core';

export interface AlTicketMasterResponse {
    ticket: string;
}

export class AlTicketMasterClientInstance {

    private serviceName = 'ticketmaster';

    /**
     * Function to get the ticket
     *
     * @param accountID string
     *
     * @returns Observable
     */
    async getTicket(accountId: string): Promise<AlTicketMasterResponse> {
        const ticket = await AlDefaultClient.post({
            service_name: this.serviceName,
            account_id: accountId,
            path: 'ticket',
        });
        return ticket;
     }
}
