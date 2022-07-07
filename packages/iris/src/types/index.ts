import { ElaborationInterface } from './elaboration.interface';

export * from './al-observation';
export * from './elaboration-event.class';
export * from './elaboration-guard-duty.class';
export * from './elaboration-log.class';
export * from './elaboration.class';
export * from './elaboration.interface';
export * from './evidence.class';
export * from './old-types';
export * from './source-type.class';
export * from './additional-evidence-types';
export * from './incident.class';

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
