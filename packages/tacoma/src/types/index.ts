/**
 *  A collection of interfaces and classes to support interaction with the tacoma API.
 *
 *  Author: Kevin Nielsen
 *  Copyright 2019 by Alert Logic, Inc.
 */

export interface AlTacomaView {
    id:             string;
    name:           string;
    description:    string;
    content_url:    string;
    embed_url:      string;
    saved_views?:   AlSavedView[];
    subscriptions:  string[];
    filter_names?:  string[];
    schedule_frequency?: string[] | false;
    parent_account_only?: boolean;
    report_format?: string[];
    run_once_time_ranges?: AlRunOnceTimeRanges[];
    allowed_schedule_hours?: {
        to: number;
        from: number;
    };
    schedule_after?: number;
    default_report_format?: string;
    interactive_report:boolean;
}

export interface AlTacomaWorkbook {
    id:             string;
    name:           string;
    views:          AlTacomaView[];
    tags:           string[];
    subscriptions:  string[];
    sub_menu:       string;
    project?: {
        name:       string;
        id:         string;
    };
    owner: {
        id:         string;
    };
    icon_name:      string;
    description:    string;
    content_url:    string;
}

export interface AlTacomaSite {
    id:             string;
    name:           string;
    content_url:    string;
    workbooks:      AlTacomaWorkbook[];
}

export interface AlTacomaViewDictionary {
    sites:          AlTacomaSite[];
    workbooks:      AlTacomaWorkbook[];
    views:          AlTacomaView[];
    menus:          {[menuName:string]:AlTacomaWorkbook[]};
}

export interface AlSavedView {
    id:             string;
    name:           string;
    embed_url:      string;
}

export interface AlRunOnceTimeRanges {
    type: string;
    timeframes: number;
}
