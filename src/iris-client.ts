/**
 * Module to deal with available Iris Public API endpoints
 */
import { ALClient } from '@al/client';

export interface ConstantTuple {
  [index: string]: string;
}

export interface ConstantDefinition {
  dsl_functions?: any;
  dsl_operators?: ConstantTuple[];
  incident_class_names?: any;
  incident_history_types?: any;
  log_types?: any;
  source_map?: any;
}

export interface IncidentQuery {
  query: {
    select: string[];
    where: {
      between: any;
      cidr_match?: string[];
      and?: any;
      or?: any;
      not?: any;
      Comparison_operators?: any;
      in?: any;
    };
    order_by?: string[];
    limit?: number
  };
}

export interface IncidentQueryParams {
  hideChildren?: boolean;
  aid?: string;
  legacyQuery?: string;
  timezone?: string;
  includeEarly?: boolean;
}

export interface IncidentSearchIncidentList {
  incident?: {
    [index: string]: string;
  };
  incidentId?: string;
  victim?: {
    account?: string;
    instanceId?: string;
    region?: string;
  };
}

export interface IncidentSearchSummaryList {
  affected_hosts_total?: string;
  assets?: {
    deployments?: any;
    regions?: any;
    subnets?: any;
    vpcs?: any;
  };
  category?: any;
  events_sum?: number;
  incidents_completed?: number;
  incidents_open?: number;
  incidents_snoozed?: number;
  sources?: any;
}

export interface IncidentSearchSummaryItem {
  count?: number;
  end_date?: string;
  end_timestamp?: number;
  start_date?: string;
  start_timestamp?: number;
  threatRating?: {
    Critical?: number;
    High?: number;
    Info?: number;
    Low?: number;
    Medium?: number;
  };
}

export interface IncidentSearchSummaryRange {
  last_day?: IncidentSearchSummaryItem;
  last_month?: IncidentSearchSummaryItem;
  last_week?: IncidentSearchSummaryItem;
  this_month?: IncidentSearchSummaryItem;
  this_week?: IncidentSearchSummaryItem;
  today?: IncidentSearchSummaryItem;
}

export interface IncidentSearchResponse {
  aggregation?: any;
  incidents?: IncidentSearchIncidentList[];
  summary?: IncidentSearchSummaryList;
  summary_by_date_range?: IncidentSearchSummaryRange;
  took?: number;
  total_incidents?: number;
}

export interface IncidentHistoryResponse {
  details?: {
    threatRating?: string;
  };
  historyType?: number;
  message?: string;
  time?: number;
  time_str?: string;
  who?: string;
}

export interface IncidentBatchData {
  operation?: string;
  reason_code: string;
  notes?: string;
  incidents?: string[];
}

export interface IncidentBatchUpdateReponse {
  undo_token?: string;
  updates?: any;
}

export interface IncidentNoteListResponse {
  alertlogic_notes?: any;
  user_notes?: any;
}

export interface IncidentStateChangeResponse {
  new?: {
    notes?: string;
    reason_code?: string;
    status?: string;
    status_change_time?: string;
  };
  old?: {
    status?: string;
    status_change_time?: string;
  };
}

export interface IncidentIdResponse {
  accountId?: number;
  createTime?: string;
  incidentId?: string;
}

export interface IncidentSnooze {
  notes?: string;
  period_ms?: number;
  reactivates_at?: string;
  reason_code?: string;
  snoozed?: boolean;
  snooze_by?: string;
  user?: string;
  expiration?: number;
  expiration_str?: string;
}

export interface UndoDataDefinition {
  performed_by?: string;
  total_updated?: number;
  update_time?: number;
  updates?: {
    [index: string]: {
      account_id?: string;
      change?: {
        new?: IncidentSnooze;
        old?: IncidentSnooze;
      };
      message?: string;
      property?: string;
    };
  };
}

class IRISClient {

  private alClient = ALClient;
  private serviceName = 'iris';

  /**
   * Fetch the assets elaboration for this incident, if it exists
   * GET
   * /iris/v2/:accountId/:incidentId/elaborations/assets
   * "https://api.cloudinsight.alertlogic.com/iris/v2/100/f00b0abab/elaborations/assets"
   */
  async getElaborations(accountId: string, incidentId: string, returnValue?: string) {
    const elaborations = await this.alClient.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      version: 'v2',
      path: `/${incidentId}/elaborations/assets`,
      params: returnValue,
    });
    return elaborations;
  }

  /**
   * DSL Translate to al_query
   * POST
   * /iris/v2/incidents/dsl-translate
   * "https://api.cloudinsight.alertlogic.com/iris/v2/incidents/dsl-translate"
   * -d '{"query_string": ["LIKE(Unauthorized),incident.threatRating>High"]}'
   */
  async dslTranslate(queryParams: {query_string: string[]}) {
    const translate = await this.alClient.post({
      service_name: this.serviceName,
      version: 'v2',
      path: '/incidents/dsl-translate',
      params: queryParams,
    });
    return translate;
  }

  /**
   * Get System Constants
   * GET
   * /iris/v2/incidents/helpers
   * "https://api.cloudinsight.alertlogic.com/iris/v2/incidents/helpers"
   */
  async getConstants() {
    const constants = await this.alClient.fetch({
      service_name: this.serviceName,
      version: 'v2',
      path: '/incidents/helpers',
    });
    return constants as ConstantDefinition;
  }

  /**
   * Translate search to al_query
   * POST
   * /iris/v2/incidents/translate
   * "https://api.cloudinsight.alertlogic.com/iris/v2/incidents/translate"
   * -d '{"search_request": {...}}'
   */
  async searchTranslate(queryParams: {search_request: any}) {
    const translate = await this.alClient.post({
      service_name: this.serviceName,
      version: 'v2',
      path: '/incidents/translate',
      params: queryParams,
    });
    return translate;
  }

  /**
   * Fetch the associated logs/events for this incident
   * GET
   * /iris/v2/:accountId/:incidentId/elaborations/associated
   * "https://api.cloudinsight.alertlogic.com/iris/v2/100/f00b0abab/elaborations/associated"
   */
  async getAssociatedElaborations(accountId: string, incidentId: string, returnValue?: string) {
    const elaborations = await this.alClient.fetch({
      account_id: accountId,
      service_name: this.serviceName,
      version: 'v2',
      path: `/${incidentId}/elaborations/associated`,
      params: returnValue,
    });
    return elaborations;
  }

  /**
   * Fetch the attatched logs/events for this incident
   * GET
   * /iris/v2/:accountId/:incidentId/elaborations/attached
   * "https://api.cloudinsight.alertlogic.com/iris/v2/100/f00b0abab/elaborations/attached"
   */
  async getAttatchedElaborations(accountId: string, incidentId: string, returnValue?: string) {
    const elaborations = await this.alClient.fetch({
      account_id: accountId,
      service_name: this.serviceName,
      version: 'v2',
      path: `/${incidentId}/elaborations/attached`,
      params: returnValue,
    });
    return elaborations;
  }

  /**
   * Incident search
   * POST
   * /iris/v2/:account_id/incident/search
   * "https://api.cloudinsight.alertlogic.com/iris/v2/incidents/translate"
   */
  async incidentSearch(accountId: string, queryData: IncidentQuery, queryParams?: IncidentQueryParams) {
    const results = await this.alClient.post({
      account_id: accountId,
      service_name: this.serviceName,
      version: 'v2',
      path: '/incident/search',
      params: queryParams,
      data: queryData,
    });
    return results as IncidentSearchResponse;
  }

  /**
   * Fetch an specific incident by id
   * GET
   * /:account_id/:incident_id/incident/fetch
   * "https://api.cloudinsight.alertlogic.com/iris/v2/100/f00b0abab/incident/fetch"
   */
  async getIncidentById(accountId: string, incidentId: string, returnValue?: string) {
    const incident = await this.alClient.fetch({
      account_id: accountId,
      service_name: this.serviceName,
      version: 'v2',
      path: `/${incidentId}/incident/fetch`,
      params: returnValue,
    });
    return incident;
  }

  /**
   * Fetch incident history for the customer console UI
   * GET
   * /iris/v2/:accountId/:incidentId/incident/log
   * "https://api.cloudinsight.alertlogic.com/iris/v2/100/ascads/incident/log"
   */
  async getIncidentHistory(accountId: string, incidentId: string) {
    const incident = await this.alClient.fetch({
      account_id: accountId,
      service_name: this.serviceName,
      version: 'v2',
      path: `${incidentId}/ascads/incident/log`,
    });
    return incident as IncidentHistoryResponse[];
  }

  /**
   * Get aggregations for a list of fields
   * POST
   * /iris/v2/:account_id/incident/aggregations
   * "https://api.cloudinsight.alertlogic.com/iris/v2/2/incident/aggregations?size=0"
   */
  async getAggregationsForFields(accountId: string, queryParams?: {multi?: boolean, size?: number, meta?: boolean}) {
    const aggregations = await this.alClient.post({
      account_id: accountId,
      service_name: this.serviceName,
      version: 'v2',
      path: '/incident/aggregations',
      params: queryParams,
    });
    return aggregations;
  }

  /**
   * Incident note update
   * PUT
   * /iris/v2/:account_id/:incident_id/incident/note/:note_id
   * "https://api.cloudinsight.alertlogic.com/iris/v1/1234/e7119f0d76d29879/incident/note/234234-23423432-2342343412341234"
   * -d {"note": "This is a note" }
   */
  async updateNote(accountId: string, incidentId: string, noteId: string, noteData: {note: string}) {
    const note = await this.alClient.set({
      account_id: accountId,
      service_name: this.serviceName,
      version: 'v2',
      path: `/${incidentId}/incident/note/${noteId}`,
      data: noteData,
    });
    return note;
  }

  /**
   * Incident status batch update
   * POST
   * /iris/v2/:account_id/incident/status
   * "https://api.cloudinsight.alertlogic.com/iris/v2/19651/incident/status"
   * -d '{ "operation": "open", "reason_code": "further_action", "notes": "whatever customer thinks is useful!", "incidents": ["e811af1c88c16a4f"] }'
   */
  async incidentStatusBatchUpdate(accountId: string, batchData: IncidentBatchData) {
    const note = await this.alClient.post({
      account_id: accountId,
      service_name: this.serviceName,
      version: 'v2',
      path: '/incident/status',
      data: batchData,
    });
    return note as IncidentBatchUpdateReponse;
  }

  /**
   * List notes on an incident
   * GET
   * /iris/v2/:account_id/:incident_id/incident/note
   * "https://api.cloudinsight.alertlogic.com/iris/v2/1234/e7119f0d76d29879/incident/note"
   */
  async getIncidentNoteList(accountId: string, incidentId: string) {
    const notes = await this.alClient.fetch({
      account_id: accountId,
      service_name: this.serviceName,
      version: 'v2',
      path: `${incidentId}/incident/note`,
    });
    return notes as IncidentNoteListResponse;
  }

  /**
   * New incident note
   * POST
   * /iris/v2/:account_id/:incident_id/incident/note
   * "https://api.cloudinsight.alertlogic.com/iris/v2/1234/e7119f0d76d29879/incident/note"
   * -d {"note": "This is a note" }
   */
  async newIncidentNote(accountId: string, incidentId: string, noteData: {note: string}) {
    const note = await this.alClient.post({
      account_id: accountId,
      service_name: this.serviceName,
      version: 'v2',
      path: `/${incidentId}/incident/note`,
      data: noteData,
    });
    return note;
  }

  /**
   * Perform batch update on incidents feedback
   * POST
   * /iris/v2/:account_id/incident/feedback
   * "https://api.cloudinsight.alertlogic.com/iris/v2/19651/incident/feedback"
   * -d '{ "operation": "open", "reason_code": "further_action", "notes": "whatever customer thinks is useful!", "incidents": ["e811af1c88c16a4f"] }'
   */
  async incidentFeedbackBatchUpdate(accountId: string, batchData: IncidentBatchData) {
    const note = await this.alClient.post({
      account_id: accountId,
      service_name: this.serviceName,
      version: 'v2',
      path: '/incident/feedback',
      data: batchData,
    });
    return note as IncidentBatchUpdateReponse;
  }

  /**
   * Perform close incident for the customer UI
   * POST
   * /iris/v2/:accountId/:incidentId/incident/close
   * "https://api.cloudinsight.alertlogic.com/iris/v2/19651/2d3424342/incident/close"
   * -d '{ "reason_code": "further_action",  "notes": "We are done with this" }'
   */
  async closeIncident(accountId: string, incidentId: string, closeData: {reason_code: string, notes: string}) {
    const note = await this.alClient.post({
      account_id: accountId,
      service_name: this.serviceName,
      version: 'v2',
      path: `/${incidentId}/incident/close`,
      data: closeData,
    });
    return note as IncidentStateChangeResponse;
  }

  /**
   * Reopen an incident in the customer UI
   * POST
   * /iris/v2/:accountId/:incidentId/incident/reopen
   * "https://api.cloudinsight.alertlogic.com/iris/v2/19651/2d3424342/incident/reopen"
   * -d '{ "notes": "Need to check this out again" }'
   */
  async reopenIncident(accountId: string, incidentId: string, reopenData: {notes: string}) {
    const note = await this.alClient.post({
      account_id: accountId,
      service_name: this.serviceName,
      version: 'v2',
      path: `/${incidentId}/incident/reopen`,
      data: reopenData,
    });
    return note as IncidentStateChangeResponse;
  }

  /**
   * Return the actual incident id for a short friendly id
   * GET
   * /iris/v2/:accountId/incident/friendly/:shortIncidentId
   * "https://api.cloudinsight.alertlogic.com/iris/v2/19651/incident/friendly/asv3s2"
   */
  async getIncidentId(accountId: string, shortIncidentId: string) {
    const id = await this.alClient.fetch({
      account_id: accountId,
      service_name: this.serviceName,
      version: 'v2',
      path: `/incident/friendly/${shortIncidentId}`,
    });
    return id as IncidentIdResponse;
  }

  /**
   * Snooze a list of incidents in the customer UI
   * POST
   * /iris/v2/:account_id/incident/snooze
   * "https://api.cloudinsight.alertlogic.com/iris/v2/19651/incident/snooze"
   * -d '{ "period_ms": 1, "reason_code": "tomorrow", "notes": "Snoozed until Bob fixes this", "incidents": ["e811af1c88c16a4f"] }'
   */
  async snoozeIncidents(accountId: string, snoozeData: {period_ms: number, reason_code: string, notes: string, incidents: string[]}) {
    const snooze = await this.alClient.post({
      account_id: accountId,
      service_name: this.serviceName,
      version: 'v2',
      path: '/incident/snooze',
      data: snoozeData,
    });
    return snooze as IncidentBatchUpdateReponse;
  }

  /**
   * Snooze an incident in the customer UI
   * POST
   * /iris/v2/:account_id/:incident_id/incident/snooze
   * "https://api.cloudinsight.alertlogic.com/iris/v2/19651/2d3424342/incident/snooze"
   * -d '{ "period_ms": 1, "reason_code": "tomorrow", "notes": "Snoozed until Bob fixes this" }'
   */
  async snoozeIncident(accountId: string, incidentId: string, snoozeData: {period_ms: number, reason_code: string, notes: string}) {
    const snooze = await this.alClient.post({
      account_id: accountId,
      service_name: this.serviceName,
      version: 'v2',
      path: `/${incidentId}/incident/snooze`,
      data: snoozeData,
    });
    return snooze as IncidentSnooze;
  }

  /**
   * Undo cached actions on incidents by token
   * POST
   * /iris/v2/:account_id/incident/undo
   * "https://api.cloudinsight.alertlogic.com/iris/v2/:account_id/incident/undo"
   * -d '{ "performed_by":"John Diaz <jdiaz@alertlogic.com>", "total_updated":1, "update_time":1537804956.345696, \
   * "updates":{ "e81109b776a84ec9":{ "account_id":134232303, "change":{ "new":{ "expiration":1537909356.345745, \
   * "expiration_str":"2018-09-25T21:02:36.345745+00:00", "notes":"Does this work again, testing undo 3!", "period_ms":86400000, \
   * "reactivates_at":"2018-09-25 16:02:36.345745", "reason_code":"next_week", "snooze_by":"John Diaz <jdiaz@alertlogic.com>", \
   * "snoozed":true }, "old":{ "expiration":1537909172.469218, "expiration_str":"2018-09-25T20:59:32.469218+00:00", \
   * "notes":"Does this work again, testing undo 3!", "period_ms":86400000, "reactivates_at":"2018-09-25 15:59:32.469218", \
   * "reason_code":"next_week", "snooze_by":"John Diaz <jdiaz@alertlogic.com>", "snoozed":true } }, \
   * "message":"Updated: snooze_status", "property":"snooze_status" } }}'
   */
  async incidentUndoByToken(accountId: string, undoData: UndoDataDefinition) {
    const undo = await this.alClient.post({
      account_id: accountId,
      service_name: this.serviceName,
      version: 'v2',
      path: '/incident/undo',
      data: undoData,
    });
    return undo as ConstantTuple[];
  }

}

export const iRISClient = new IRISClient();
