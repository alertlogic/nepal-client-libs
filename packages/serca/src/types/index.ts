
/* tslint:disable:variable-name */
export interface SercaSeachResult {
    search_result: {
        total_found: number,
        status_details: string,
        search_uuid: string,
        search_status: string,
        search_start: number,
        search_end: number,
        results: {
            records: unknown[],
            metadata: { [key: string]: unknown },
            columns: string[]
        },
        remaining: number,
        offset: number,
        external_details: string,
        data_type: string,
        account_id: string
    };
}
