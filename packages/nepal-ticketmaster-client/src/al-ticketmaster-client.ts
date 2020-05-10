/**
 * Module to deal with available Correlations Public API endpoints
 */
import {
  AlDefaultClient, AlApiClient
} from '@al/core';

export interface AlTicketMasterResponse {
    ticket: string;
}

export class AlTicketMasterClientInstance {

    protected client:AlApiClient;
    private serviceName = 'ticketmaster';

    constructor(client:AlApiClient = null) {
        this.client = client || AlDefaultClient;
    }

    /**
     * Function to get the ticket
     *
     * @param accountID string
     *
     * @returns Observable
     */
    async getTicket(accountId: string): Promise<AlTicketMasterResponse> {
        const ticket = await this.client.post({
            service_name: this.serviceName,
            account_id: accountId,
            path: 'ticket',
        });
        return ticket;
     }
}
