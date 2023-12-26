import { AlChangeStamp } from '@al/core';
import { ElaborationInterface } from './elaboration.interface';

export * from './additional-evidence-types';
export * from './al-observation';
export * from './elaboration-event.class';
export * from './elaboration-guard-duty.class';
export * from './elaboration-log.class';
export * from './elaboration.class';
export * from './elaboration.interface';
export * from './epmsgs.types';
export * from './evidence.class';
export * from './incident.class';
export * from './old-types';
export * from './source-type.class';

export interface AlIncidentFilterDictionary {
  classifications:{[classification:string]:{
      value:string,
      caption:string
    }};

  detectionSources:{[detectionSource:string]:{
      value:string,
      caption:string
    }};

  threatLevels:{[threatLevel:string]:{
      value:string,
      caption:string
    }};
}

export interface MetaDataDictionary {
    "incident-class-names":{ [i:string]:string };
    "incident-history-types":{ [i:string]:string };
    "log-types":{ [i:string]:string };
    "sourceMap":{ [i:string]:string };
}

/**
 * SearchFilterGroup - Used to structure the filter grouping for advanced search
 *
 * ie.
 * "groupBy": {
 *                "field": "source_keyword",
 *                "sort": ["guardduty", "IDS", "LOG", "MANI", "MANL", "N/A"],
 *                "default": "N/A",
 *                "sub_sort": "incident.begin_time_str:desc"
 *            },
 */

/* tslint:disable:variable-name prefer-array-literal */
export class SearchFilterGroup {
    // The property used to group the data
    // public property:string;
    public field:string;
    // public sort:Array<string>;
    public sort:string;
    public default:string;
    public sub_sort:string;
    public boost:any;
    public time_spans:string[];

    /**
     *  Deserialize a raw data entry to build and return a SearchFilterGroup.
     *  @param {string} rawData A raw object containig the filter data grouping - From stored user's filter
     *  @returns SearchFilterGroup An object reflecting a search filter grouping
     */
    public static deserialize(rawData:any):SearchFilterGroup {
        const searchFilterGroup = new SearchFilterGroup();
        if (rawData.hasOwnProperty("field")) {
            searchFilterGroup.field = rawData.field;
        }
        if (rawData.hasOwnProperty("sort")) {
            searchFilterGroup.sort = rawData.sort;
        }
        if (rawData.hasOwnProperty("default")) {
            searchFilterGroup.default = rawData.default;
        }
        if (rawData.hasOwnProperty("sub_sort")) {
            searchFilterGroup.sub_sort = rawData.sub_sort;
        }
        if (rawData.hasOwnProperty("boost")) {
            searchFilterGroup.boost = rawData.boost;
        }
        if (rawData.hasOwnProperty("time_spans")) {
            searchFilterGroup.time_spans = rawData.time_spans;
        }
        return searchFilterGroup;
    }
}


export type RetinaFilterOp =
    { eq:RetinaFilterBase }
    | { and:RetinaFilterCollection }
    | { or:RetinaFilterCollection }
    | { in:{property:string; value:string[]} }
    | { not:RetinaFilterOp }
    | { exists:{property:string} }
    | { gtTime:RetinaFilterBase }
    | { ltTime:RetinaFilterBase }
    | { regex:{property:string; value:string; decode?:string } }
    | { substringi:{property:string; value:string; decode?:string } }
    | { substring:{property:string; value:string; decode?:string; keyencoding?:string } }
    | RetinaFilterBase
    | {};
export type RetinaFilterCollection = RetinaFilterOp[];

export interface RetinaFilterBase {
    property:string;
    value:string | number;
    decode?:string;
}

export class RetinaBody {
    returnValues?:"*" | string[] ;
    aggregation?:string[];
    filter?:RetinaFilterOp;
    format?:{ limit?:number; offset?:number; order?:{ by:string; direction:'asc' | 'desc' } };
    matchCount?:MatchCountQueryItem[];

    raw_totals?:RetinaFilterOp|boolean;
    fields?:SummaryField[];
    group_by?:SearchFilterGroup|{};

}

export interface RetinaReturn {
    aggregation?:{ [s:string]:{ [s:string]:number } };
    filter?:object | string;
    returnVals?:ElaborationInterface[];
    stats?:{
        matchCounts:{[i:string]:number[]};
        numItemsInDataSource:number;
        numberOfMatchingElaborations:number;
        queryExecutionTime:{
            Aggregation:string;
            Filter:string;
            Hydration:string;
            "Match Counts":string;
            Results:string;
            TimeSlice:string;
            "Total Query":string;
        };
    };
    timeSlice?:object;

    timespan?:any;

}

export interface RetinaUrlParams {
    multi?:boolean;
    meta?:boolean;
    raw_totals?:boolean;
    size?:number;
}


export class MatchCountQueryItem {
    substringi?:RetinaFilterBase;
    substring?:RetinaFilterBase;
    regex?:RetinaFilterBase;
}

export interface SummaryField {
    key_name?:string;
    name?:string;
    type?:string;
    sub?:SummaryField[];
    filters?:Array<{[i:string]:string|boolean}>;
    time_zone?:string;
    ranges?:Array<{to:string; from:string; key:string}>;
}

export interface EvidenceParams {
    search:string;
    sourcesFilter:string[];
    evidenceFilter:EvidenceFilter[];
}

export interface FilterItem {
    key:string;
    title:string;
    total:number;
    active?:boolean;
}

export interface EvidenceFilter {
    key:string;
    value:string;
}

export interface RawFilterColumns {
    filter_order?: number;
    iris_field_name: string;
    ui_display_name: string;
    use_as_column: boolean;
    use_as_filter: boolean;
    sorted?: boolean;
}

export type MassUpdatePayload = StateUpdatePayload | PropertiesUpdatePayload;

export interface StateUpdatePayload {
    newState: {
        "incidentState": string;
        "assignedOperatorId": string;
    };
}

export interface PropertiesUpdatePayload {
    properties: {
        property: string,
        newValue: any,
    }[];
}

export interface WriteFieldBodyUpdate {
    property: string;
    newValue: any;
    comment?: string;
}

export interface WriteFieldBody {
    updates: WriteFieldBodyUpdate[];
    incident_update_version?: number;
    sessionId?: string;
    clientTime?: string;
}

export interface ZenDeskItem {
    id: number;
    created_at?: string;
    updated_at?: string;
    formattedUpatedTime: string;
    title?: string;
    status?: string;
    type?: string;
    url?: string;
    urlForJson?: string;
}

export interface JSONStore {
    accountId: string;
    key: string;
    val: { [k: string]: object };
}

export interface SocTemplateData {
    format: number;
    title: string;
    text: string;
    filter?: string;
}

export interface SocTemplate {
    id?: string;
    changeId?: number;
    doIncrement?: boolean;
    tag?: string;
    data: SocTemplateData;
    leaseSeconds?: number;
    who?: string;
}

export interface WhoData {
    access_keys: string[];
    account_id: string;
    active: boolean;
    created: AlChangeStamp;
    email: string;
    endpoints_user_id: number;
    id: string;
    linked_users: Array<{ location: string; user_id: number }>;
    locked: boolean;
    modified: AlChangeStamp;
    name: string;
    user_credential: {
        created: AlChangeStamp;
        last_login: number;
        modified: AlChangeStamp;
        one_time_password: boolean;
        version: number;
    };
    username: string;
    version: number;
}

export interface TemplateReadRec {
    id: string;
    version: number;
    changeId: number;
    who: WhoData | string;
    _who?: string;
    when: string;
    _when?: string;
    isLeaseHolder: boolean;
    leaseExpireTime?: string;
    data: SocTemplateData;
    hibernateRec?: {
        who: WhoData | string;
        when: string;
        _who?: string;
    };
}

export namespace AlManualIncidentRequest {
    export type SourcesEnum = 'MANL' | 'MANI';
    export const sourcesEnum = {
        MANL: 'MANL' as SourcesEnum,
        MANI: 'MANI' as SourcesEnum
    };
    export type ThreatRatingEnum = 'Low' | 'Medium' | 'Hihg' | 'Critical';
    export const threatRatingEnum = {
        Low: 'Low' as ThreatRatingEnum,
        Medium: 'Medium' as ThreatRatingEnum,
        Hihg: 'Hihg' as ThreatRatingEnum,
        Critical: 'Critical' as ThreatRatingEnum
    };
}


export interface AlManualIncidentFactMessage {
    id?: string;
    type?: string;
}

export interface AlManualIncidentFact {
    message?: AlManualIncidentFactMessage[];
}

export interface AlManualIncidentRequest {
    /**
     * The Account (customer) Id
     */
    customer_id: number;
    /**
     * The Incident Summary
     */
    summary: string;
    /**
     * The Incident Description
     */
    description: string;
    /**
     * The Incident Classification
     */
    classification: string;
    /**
     * The duration (in minutes)
     */
    time_frame: number;
    /**
     * A list of message_id and type (associated events or logs)
     */
    facts: AlManualIncidentFact[];
    /**
     * Only for MANI
     */
    correlation: string[];
    /**
     * The datacenter that facts are coming from (Ashburn, Denver, Integration, Newport, etc)
     */
    datacenter?: string;
    /**
     * The Incident Source (MANL for log, MANI for IDS)
     */
    sources?: AlManualIncidentRequest.SourcesEnum[];
    /**
     * The base_incident_keyedon_value
     */
    keyedon_value?: string;
    /**
     * The generator type (analytic, guardduty, log_correlation, etc)
     */
    gen_type?: string;
    /**
     * The threat rating for the incident (Low, Medium, High, Critical)
     */
    threat_rating?: AlManualIncidentRequest.ThreatRatingEnum;
}

export interface AlManualIncidentResponse {
    status?: string;
    message?: string;
}
