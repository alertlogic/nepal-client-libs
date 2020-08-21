/**
 *  A container for Suggestion Template type.
 *
 *  @author Fair Tarapues <fair.tarapues@alertlogic.com>
 *  @copyright Alert Logic, Inc 2020
 */

export interface AlCreateQueryTemplateV2 {
    group_id: string | null;
    name: string;
    description: string;
    search_request: string;
}

export interface AlUpdateQueryTemplateV2 {
    group_id?: string | null;
    name?: string;
    description?: string;
    search_request?: string;
    deleted?: boolean;
}

export interface AlSuggestionsTemplateResponseV2 {
    id: string;
    account_id: string;
    group_id: string | null;
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
    group_id: string | null;
    name: string;
    description?: string;
    search_request: string;
    template?: {
        id: string,
        account_id: string
    };
}

export interface AlUpdateSavedQueryParamsV2 {
    group_id?: string | null;
    name?: string;
    description?: string;
    search_request?: string;
    deleted?: boolean;
    template?: {
        id: string,
        account_id: string
    };
}

export interface AlSavedQueryV2 {
    id: string;
    account_id: string;
    group_id: string | null;
    name: string;
    description?: string;
    data_type: string;
    search_request: string;
    deleted?: boolean;
    template?: {
        id: string,
        account_id: string
    };
    created: {
        at: number;
        by: string;
    };
    modified: {
        at: number;
        by: string;
    };
}
