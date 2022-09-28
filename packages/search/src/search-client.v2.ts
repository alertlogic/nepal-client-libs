/**
 * A client for interacting with the Alert Logic Search Public API.
 */
import {
    AlLocation,
    AlDefaultClient,
    APIRequestParams,
} from "@al/core";

import { AlMessageDataType } from '@al/msgaccess';

export interface AlSearchSubmitV2 {
    update_ts: number;
    status_details: string;
    start_ts: number;
    search_uuid: string;
    search_status: string;
    results: Array<AlLogMessageV2>;
}

export interface AlLogMessageV2 {
    id: AlLogMessageIdV2;
    fields: AlLogMessageFieldsV2;
}

export interface AlLogMessageIdV2 {
    msgid: string;
    aid: string;
    account: string;
}

export interface AlLogMessageFieldsV2 {
    time_recv: string;
    source_id: string;
    program: string;
    priority: string;
    pid: string;
    metadata: any[];
    message: string;
    ingest_id: string;
    host_name: string;
    header: string;
    facility: string;
}

export interface AlSearchGetV2 {
    search_uuid: string;
    data_type: string;
    search_status: string;
    status_details: string;
    details: AlSearchDetailsV2;
    progress?: number;
    remaining?: number;
    results?: AlSearchGetResultsV2;
    next_token?: string;
    offset: number;
    total_found: number;
    external_details: string;
}

export interface AlSearchDetailsV2 {
    query: string;
    search_type: string;
    submit_ts: number;
    update_ts: number;
    stats: AlSearchStatsV2;
    request: string;
}

export interface AlSearchStatsV2 {
    fetchers_executed: number;
    filtered_batches: number;
    filtered_bytes: number;
    filtered_compressed_bytes: number;
    filtered_records: number;
    filters_executed: number;
    filters_scheduled: number;
    input_scanned_bytes: number;
    input_scanned_packets: number;
    input_scanned_records: number;
    output_records: number;
    recurse_sorts: number;
    sort_recurse_time: number;
    sorts_executed: number;
}

export interface AlSearchGetResultsV2 {
    columns: Array<string>;
    records: Array<AlSearchResultRecordV2>;
    metadata: { [key: string]: string };
}

export interface AlSearchResultRecordV2 {
    fields: { [key: string]: unknown };
    id: AlSearchResultRecordIdV2;
}

export interface AlSearchResultRecordIdV2 {
    account: number;
    aid: number;
    msgid: string;
    datatype: AlMessageDataType;
}

export interface AlSearchResultsQueryParamsV2 {
    limit?: number;
    offset?: number;
    details?: boolean;
    next_token?: string;
    utc_offset?: string;
    from_epochtime?: AlFromEpochTime;
    selected?: string;
}

export interface AlFromEpochTime {
    utc_offset?: string;
    date_format?: string;
}

export interface AlSearchStatusV2 {
    search_status: string;
    status_details: string;
    details: AlSearchDetailsV2;
    search_uuid: string;
    total_found?: number;
    authoritative_retry?: string;
    retried_by?: string[];
    rerun?: string;
    external_details: string;
    request: string;
    requested_type: 'auto'|'batch'|'report';
    search_type: 'interactive'|'batch'|'report';
    submit_ts: number;
    update_ts: number;
    stats: AlSearchStatusStatsV2;
    progress?: number;
    search_end: number;
    search_start: number;
    search_progress?: AlSearchProgressV2;
}

export interface AlSearchProgressV2 {
    input_scanned_records: number;
    input_scanned_bytes: number;
    estimated_output_records: number;
}

export interface AlSearchStatusStatsV2 {
    fetchers_executed: number;
    filter_process_time: number;
    filtered_batches: number;
    filtered_bytes: number;
    filtered_compressed_bytes: number;
    filtered_records: number;
    filters_executed: number;
    filters_scheduled: number;
    input_scanned_bytes: number;
    input_scanned_packets: number;
    input_scanned_records: number;
    intervals_requested: number;
    libalalgo_gaps_parse_call_count: number;
    libalalgo_json_parse_call_count: number;
    libalalgo_kv_parse_call_count: number;
    messages_parse_error: number;
    messages_parsed: number;
    messages_unparsed: number;
    output_records: number;
    recurse_sorts: number;
    sort_recurse_time: number;
    sorts_executed: number;
}

export interface AlAdditionalSubmitParams {
    search_type?: string;
    dry_run?: string;
    start?: number;
    end?: number;
    timeframe?: number;
    child_accounts?: string|string[];
}

// Grammar related interfaces
export interface AlSearchSQLGrammarSpec {
    help: string;
    insertText: string;
    label: string;
}

export interface AlSearchSQLGrammar {
    [key: string]: {
        keywords: {
            [key: string]: {
                spec: AlSearchSQLGrammarSpec[]
            }
        }
    };
}

class AlSearchClientV2 {

    private serviceName = 'search';

    /**
     *  Submit the Search Text to be processed
     */
    async submit(searchQuery: string, accountId: string, additionalParams?: AlAdditionalSubmitParams): Promise<AlSearchSubmitV2> {
        const submitRequestArgs: APIRequestParams = {
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: 2,
            account_id: accountId,
            path: `/searches`,
            data: searchQuery,
            headers: {'Content-Type': 'text/plain', 'x-invoked-by': 'ui'}
        };
        if (additionalParams) {
            submitRequestArgs.params = additionalParams;
        }
        const results = await AlDefaultClient.post(submitRequestArgs);

        return results as AlSearchSubmitV2;
    }

    /**
     *  Get the Search results based in the uuid, additional parameters are allowed
     */
    async get(accountId: string, uuid: string, additionalParams?: AlSearchResultsQueryParamsV2): Promise<AlSearchGetV2> {
        const fetchRequestArgs: APIRequestParams = {
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: 2,
            account_id: accountId,
            path: `/searches/${uuid}`
        };
        if (additionalParams) {
            fetchRequestArgs.params = additionalParams;
        }
        const results = await AlDefaultClient.get(fetchRequestArgs);

        return results as AlSearchGetV2;
    }

    /**
     *  Get the Search status information based in the search uuid
     *
     *
     * @param accountId   Customer ID
     * @param uuid        Search ID
     *
     * @return Observable<SearchStatusV2>
     */
    async status(accountId: string, uuid: string): Promise<AlSearchStatusV2> {
        const status = await AlDefaultClient.get({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: 2,
            account_id: accountId,
            path: `/searches/${uuid}/status`,
            ttl: 0,
        });
        return status as AlSearchStatusV2;
    }

    /**
     *  Delete a currently executing search operation in the backend
     */
    async delete(accountId: string, uuid: string): Promise<any> {
        const response = await AlDefaultClient.delete({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: 2,
            account_id: accountId,
            path: `/searches/${uuid}`,
        });
        return response;
    }

    /**
     *  Get expert mode search grammar
     */
    async getGrammar(): Promise<AlSearchSQLGrammar> {
        const grammar = await AlDefaultClient.get({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: 2,
            path: `/grammar`,
        });
        return grammar as AlSearchSQLGrammar;
    }

    /**
     *  Complete interactive search (in suspended status)
     */
    async completeSuspendedSearch(accountId: string, uuid: string): Promise<void> {
        return AlDefaultClient.post({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: 2,
            account_id: accountId,
            path: `/searches/${uuid}/complete`,
        });
    }

    /**
     * Convert a SIEMless (search/v1) search into an Expert Mode SQL query (search/v2).
     */
    async convertQueryToEMS( queryJSON:any ):Promise<string> {
        return AlDefaultClient.post<string>( {
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: 2,
            path: `/convert-from-v1`,
            data: queryJSON
        } );
    }
}

export const alSearchClientV2 = new AlSearchClientV2();
