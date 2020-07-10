/**
 * These are the original typings for responses from the iris service.  They are deprecated/V1 constructs that do not obey current naming conventions.
 * Shame on them.
 */

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

export interface IncidentBatchUpdateResponse {
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

