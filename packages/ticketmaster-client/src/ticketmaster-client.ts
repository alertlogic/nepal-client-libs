/**
 * Module to deal with available Ticket Master Public API endpoints
 */
import { ALClient } from '@al/common';

export interface AgentTicket {
  id?: string;
  subject?: string;
  description?: string;
  assignee_id?: string;
  end_customer?: string;
  impact?: string;
  priority?: string;
  security_clearance?: string;
  resolution_call?: string;
  kba_status?: string;
  breach?: string;
  urgency?: string;
  origin?: string;
  feature?: string;
}

export interface Ticket {
  ticket_id?: string;
  subject?: string;
  description?: string;
  breach?: string;
  urgency?: string;
  partner_ticket_id?: string;
  issue_type?: string;
  product?: string;
  end_customer?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TicketComment {
  id?: string;
  comment?: string;
  created_at?: string;
}

export interface TicketComments {
  ticket_id?: string;
  comments?: TicketComment[];
  next_page?: number;
  count?: number;
}

export interface TicketsResponse {
  tickets: Ticket[];
}

export interface CallbackResponse {
  id?: string;
  url?: string;
}

export interface KinesisResponse {
  id?: string;
  stream_name?: string;
  tributary_id?: string;
}

class TMClient {

  private alClient = ALClient;
  private serviceName = 'tickets';

  /**
   * Create agent ticket
   * POST
   * /tickets/v1/agents
   * "https://api.global.alertlogic.com/tickets/v1/agents"
   * -d '{"subject":"Problem subject", "comment": {"body": "Problem description"}, "assignee_id":12345678, "end_customer":"Valued Customer", "main_product":"p2"}'
   */
  async createAgentTicket(id?: string, subject?: string, description?: string, assigneeId?: string, endCustomer?: string,
                          problemSummary?: string, sensorName?: string, sensorId?: string, heimdallAccount?: string,
                          feature?: string, priority?: string, impact?: string, breach?: string, urgency?: string,
                          kbaStatus?: string, category?: string, resolutionCall?: string, issueType?: string,
                          experience?: string, securityClearance?: string, origin?: string, product?: string,
                          mainProduct?: string) {
    const ticket = await this.alClient.post({
      service_name: this.serviceName,
      path: '/agents',
      data: `{
        "id": ${id},
        "subject": ${subject},
        "description": ${description},
        "assignee_id": ${assigneeId},
        "end_customer": ${endCustomer},
        "problem_summary": ${problemSummary},
        "sensor_name": ${sensorName},
        "sensor_id": ${sensorId},
        "heimdall_account": ${heimdallAccount},
        "impact": ${impact},
        "priority": ${priority},
        "category": ${category},
        "issue_type": ${issueType},
        "experience": ${experience},
        "security_clearance": ${securityClearance},
        "resolution_call": ${resolutionCall},
        "kba_status": ${kbaStatus},
        "breach": ${breach},
        "urgency": ${urgency},
        "origin": ${origin},
        "feature": ${feature},
        "product": ${product},
        "main_product": ${mainProduct}
      }`,
    });
    return ticket as unknown as AgentTicket;
  }

  /**
   * Create ticket
   * POST
   * /tickets/v1/:account_id/tickets
   * "https://api.global.alertlogic.com/tickets/v1/01000001/tickets"
   * -d '{"subject":"Problem Subject", "comment":"Problem description", "partner_ticket_id":"32844660"}'
   */
  async createTicket(accountId: string, subject: string, comment: string, partnerTicketId: string) {
    const ticket = await this.alClient.post({
      service_name: this.serviceName,
      account_id: accountId,
      path: '/tickets',
      data: `{
        "subject": ${subject},
        "comment": ${comment},
        "partner_ticket_id": ${partnerTicketId}
      }`,
    });
    return ticket as unknown as Ticket;
  }

  /**
   * Get ticket
   * GET
   * /tickets/v1/:account_id/tickets/:ticket_id
   * "https://api.global.alertlogic.com/tickets/v1/01000001/tickets/4481"
   */
  async getTicket(accountId: string, ticketId: string) {
    const ticket = await this.alClient.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/tickets/${ticketId}`,
    });
    return ticket as Ticket;
  }

  /**
   * Get ticket comments
   * GET
   * /tickets/v1/:account_id/tickets/:ticket_id/comments
   * "https://api.global.alertlogic.com/tickets/v1/01000001/tickets/4481/comments"
   */
  async getTicketComments(accountId: string, ticketId: string, queryParams?: {next_page?: string, since?: string, sort_by?: string, sort_order?: string}) {
    const comments = await this.alClient.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/tickets/${ticketId}/comments`,
      params: queryParams,
    });
    return comments as TicketComments;
  }

  /**
   * Get tickets
   * GET
   * /tickets/v1/:account_id/tickets
   * "https://api.global.alertlogic.com/tickets/v1/01000001/tickets?status=pending"
   */
  async getTickets(accountId: string, queryParams?: {next_page?: string, status?: string, sort_by?: string, sort_order?: string}) {
    const tickets = await this.alClient.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: '/tickets',
      params: queryParams,
    });
    return tickets as TicketsResponse;
  }

  /**
   * Update a ticket
   * PUT
   * /tickets/v1/:account_id/tickets/:ticket_id
   * "https://api.global.alertlogic.com/tickets/v1/01000001/tickets/4481"
   * -d '{"comment":"additional ticket comment"}'
   */
  async updateTicket(accountId: string, ticketId: string, comment?: string, partnerTicketId?: string) {
    const update = await this.alClient.set({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/tickets/${ticketId}`,
      data: `{comment: ${comment}, partner_ticket_id: ${partnerTicketId}}`,
    });
    return update as unknown as Ticket;
  }

  /**
   * Register Callback URL
   * POST
   * /tickets/v1/:account_id/updates/tickets/callback
   * "https://api.global.alertlogic.com/tickets/v1/01000001/tickets/callback"
   * -d '{"url":"https://www.example.com/callback"}'
   */
  async registerCallback(accountId: string, url: string) {
    const callbacks = await this.alClient.post({
      service_name: this.serviceName,
      account_id: accountId,
      path: '/tickets/callback',
      data: `{
        "url": ${url},
      }`,
    });
    return callbacks as unknown as CallbackResponse;
  }

  /**
   * Register for Kinesis Updates
   * POST
   * /tickets/v1/:account_id/updates/tickets/kinesis
   * "https://api.global.alertlogic.com/tickets/v1/01000001/tickets/kinesis"
   * -d '{"stream_name":"exampleStreamName", "tributary_id":"8F0A29FD-4D28-428C-8CC2-7A68CB64FEB3"}'
   */
  async registerKinesis(accountId: string, streamName: string, tributaryId?: string) {
    const kinesis = await this.alClient.post({
      service_name: this.serviceName,
      account_id: accountId,
      path: '/tickets/kinesis',
      data: `{
        "stream_name": ${streamName},
        "tributary_id": ${tributaryId}
      }`,
    });
    return kinesis as unknown as KinesisResponse;
  }

}

export const tmClient =  new TMClient();
