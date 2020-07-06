/**
 *  A container for Suggestion Template type.
 *
 *  @author Fair Tarapues <fair.tarapues@alertlogic.com>
 *  @copyright Alert Logic, Inc 2020
 */

export interface AlSuggestionsTemplateResponseV2 {
    id: string;
    account_id: string;
    group_id: string;
    name: string;
    description?: string;
    data_type: string;
    deleted: boolean;
    search_request: string;
    created: {
        at: number;
        by: string;
    };
    modified: {
        at: number;
        by: string;
    };
}

export interface AlCreateSavedQueryParamsV2 {
    group_id: string;
    name: string;
    data_type: string;
    search_request: any;
}

export interface AlSavedQueryV2 {
    id: string;
    account_id: string;
    group_id: string;
    name: string;
    description?: string;
    data_type: string;
    search_request: any;
    deleted?: boolean;
}
