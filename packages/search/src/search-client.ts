/**
 * A client for interacting with the Alert Logic Search Public API.
 */
import {
    AlLocation,
    AlDefaultClient,
    APIRequestParams,
} from "@al/core";

export interface LogMessageSearchResult {
  fields: {
    ingest_id: string;
    message: string;
    metadata: {
      create_ts: number;
      data: string;
      meta_id: string;
      uuid: string;
    }[];
    pid: number;
    priority: number;
    time_recv: number;
    source_id: string;
    host_name: string;
    facility: string;
    program: string;
  };
  id: LogMessageMetaData;
}

interface LogMessageMetaData {
  account: number;
  aid: number;
  msgid: string;
}

export interface SubmitSearchResponse {
  search_uuid: string;
  search_status: 'suspended' | 'pending' | 'complete' | 'failed';
  start_ts: number;
  update_ts: number;
  status_details: string;
  progress: number;
}

export interface FetchSearchResponse extends SubmitSearchResponse {
  results: LogMessageSearchResult[]; // In the future other message types can be returned, so not just Log Messages
  next_token?: string;
  estimated?: number;
  remaining?: number;
}

export interface SearchStatusResponse extends SubmitSearchResponse {
  query: string;
  search_type: 'batch' | 'interactive' | 'report';
}

export interface SearchResultsQueryParams {
  limit?: number;
  offset?: number;
  starting_token?: string;
}

export interface TokensMetadata {
    type: string;
    taxonomy: string;
    parent: string|null;
    path: string;
    id: string;
}

export interface LogMessageFields {
  time_recv: number;
  hostname: string;
  facility: string;
  message: string;
  parsed: {
    rule_id: string;
    rule_name: string;
    pattern_id: string;
    tokens: { [key: string]: string };
    json?: { [key: string]: unknown };
    tokens_metadata?: { [key: string]: TokensMetadata };
    tokens_offsets?: { [key: string]: number[] };
  };
  metadata: {
    uuid: string;
    create_ts: number;
    dict: {
      hostname: string;
      public_hostname: string;
      instance_id: string;
      ip_addr: string;
      public_ip_addr: string;
      os: string;
      os_version: string;
      os_arch: string;
      os_machine: string;
    }
  };
  prioriy: number;
  program: string;
  source_id: string;
}
export interface ReadLogMessageResponse {
  id: LogMessageMetaData;
  fields: LogMessageFields|IdsMessageFields|FimDataFields|ObservationFields;
}

export interface Flags {
  urg: boolean;
  syn: boolean;
  rst: boolean;
  psh: boolean;
  ns: boolean;
  fin: boolean;
  ece: boolean;
  cwr: boolean;
  ack: boolean;
  mf?: boolean;
  df?: boolean;
}

export interface Protocol {
  winsize: number;
  urgent: number;
  srcport: number;
  seq: number;
  options: string;
  offset: number;
  id: string;
  flags: Flags;
  dstport: number;
  data_off: number;
  checksum: number;
  ack: number;
  ttl?: number;
  total_length?: number;
  srcip: string;
  ident?: number;
  header_len?: number;
  frag_offset?: number;
  ecn?: number;
  dstip: string;
  diffserv?: number;
  srcmac: string;
  dstmac: string;
}

export interface Proto {
  srcport: number;
  protocols: Protocol[];
  protocol: number;
  offset: number;
  ip_src: string;
  ip_dst: string;
  dstport: number;
}

export interface Payload {
  ts_us: number;
  ts: number;
  rec_idx: number;
  proto: Proto;
  data: string;
}

export interface IdsMessageFields {
  vlan?: number;
  ts_us: number;
  ts: number;
  srcport: number;
  sig_rev: number;
  sig_id: number;
  sig_gen: number;
  proto: number;
  priority: number;
  payload: Payload[];
  orig?: boolean;
  mpls?: number;
  ip_src: string;
  ip_proxy_client?: string;
  ip_proxy?: string;
  ip_dst: string;
  ingest_ts: number;
  ingest_id: string;
  event_id: number;
  dstport: number;
  class: number;
  asset_id: string;
}

export interface ReadIdsMessageResponse extends ReadLogMessageResponse {
  fields: IdsMessageFields;
}

export interface Asset {
  dict: object;
  data: string;
  asset_id: string;
}

export interface FimDataFields {
  ts: number;
  sha1_hash: string;
  path: string;
  ingest_ts: number;
  ingest_id: string;
  host_id: string;
  file_type: string;
  file_size: number;
  file_permissions: number;
  file_owner: string;
  file_name: string;
  file_mtime: number;
  file_group: string;
  file_ctime: number;
  file_attributes: number;
  file_atime: number;
  event_type: string;
  asset: Asset;
}

export interface ReadFimDataResponse extends ReadLogMessageResponse {
  fields: FimDataFields;
}

export interface ObservationFields {
    visibility: string;
    ts: number;
    technique?: string;
    tactic?: string;
    summary: string;
    subclass: string;
    sub_technique?: string;
    start_ts: number;
    severity: string;
    scope_type: string;
    scope: string[];
    recommendations: string;
    properties_data: string;
    properties: { [key: string]: any };
    path: string;
    parents: string[];
    keys_data: string;
    keys: { [key: string]: any };
    internal_data: string;
    internal: { [key: string]: any };
    ingest_ts: number;
    ingest_id: string;
    id: string;
    handling: string[];
    evolved_to?: string;
    end_ts: number;
    desc: string;
    confidence?: number;
    class: string;
    authority: string;
}

export interface ReadObservationResponse extends ReadLogMessageResponse {
  fields: ObservationFields;
}

class SearchClient {

  private alClient = AlDefaultClient;
  private serviceName = 'search';
  /**
   * Submit Search - starts the search query job in the backend
   */
  async submitSearch(accountId: string, dataType: string, searchQuery?: any):Promise<SubmitSearchResponse> {
    const search = await this.alClient.post({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/search/${dataType}`,
      data: searchQuery,
    });
    return search as SubmitSearchResponse;
  }

  /**
   * Fetch Search Results - Access the results of the submitted search
   */
  async fetchSearchResults(accountId: string, searchId: string, queryParams?: SearchResultsQueryParams):Promise<FetchSearchResponse> {
    const fetchRequestArgs: APIRequestParams = {
      service_name: this.serviceName,
      account_id: accountId,
      path: `/fetch/${searchId}`,
      ttl: 0,
    };
    if (queryParams) {
      fetchRequestArgs.params = queryParams;
    }
    const results = await this.alClient.fetch(fetchRequestArgs);
    return results as FetchSearchResponse;
  }

  /**
   * Fetch Search Results as CSV - Access the results of the submitted search in CSV format
   */
  async fetchSearchResultsAsCSV(accountId: string, searchId: string, queryParams?: SearchResultsQueryParams):Promise<any> {
    const fetchRequestArgs: APIRequestParams = {
      service_name: this.serviceName,
      account_id: accountId,
      path: `/fetch/${searchId}`,
      ttl: 0,
      accept_header: 'text/csv',
      response_type: 'blob',
    };
    if (queryParams) {
      fetchRequestArgs.params = queryParams;
    }
    const results = await this.alClient.fetch(fetchRequestArgs);
    return results;
  }

  /**
   * Search Status - Get latest status of the submitted search
   */
  async searchStatus(accountId: string, searchId: string):Promise<SearchStatusResponse> {
    const status = await this.alClient.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/status/${searchId}`,
      ttl: 0,
    });
    return status as SearchStatusResponse;
  }

  /**
   * Release Search
   * Free resources occupied by a completed search. The resources are freed up.
   * Pending search is cancelled. Resources area also automatically released 24 hours after the search is completed
   */
  async releaseSearch(accountId: string, searchId: string):Promise<any> {
    const release = await this.alClient.post({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/release/${searchId}`,
    });
    return release;
  }

  /**
   * Read Messages
   * Read a set of messages from storage by ID. Proxy for daccess service messages API. Only addition is logmsgs data type messages are also parsed and tokenised
   */
  async readMessages(accountId: string, queryParams: { ids: string, fields?: string }):Promise<ReadLogMessageResponse[]> {
    const messages = await this.alClient.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: '/messages/logmsgs',
      params: queryParams,
    });
    return messages as ReadLogMessageResponse[];
  }

  /**
   * Read Messages POST
   * Read a set of messages from storage by ID. Proxy for daccess service messages API. Only addition is logmsgs data type messages are also parsed and tokenised
   */
  async readMessagesPost(accountId: string, dataType: string = 'logmsgs', params: { ids: string[], fields?: string }): Promise<ReadLogMessageResponse[]> {
    // Let's set the fields default value
    // which is to get all of them
    if (!params?.fields) {
      params.fields = '__all';
    }
    return AlDefaultClient.post({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      account_id: accountId,
      path: `/messages/${dataType}`,
      data: params
    });
  }
}

export const searchClient = new SearchClient();
