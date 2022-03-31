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
    tags?: string[];
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
    tags?: string[];
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
    tags?: string[];
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

export interface AlSavedQueriesV2 {
    queries: AlSavedQueryV2[];
    stats: AlSavedQueriesStats;
}

export interface AlSavedQueriesStats {
    data_type: {[key: string]: number};
    tags: {[key: string]: number};
}

export interface AlPropertyValuesV2 {
    tags: string[];
}

export type ValidPropertiesV2 = 'tags';

export interface AlEnumeratedFieldV2 {
    name: string;
    label: string;
    description: string;
    has_fields: boolean;
    has_values: boolean;
    has_cross_cid_values: boolean;
    type?: string|{[array:string]:string};
}
