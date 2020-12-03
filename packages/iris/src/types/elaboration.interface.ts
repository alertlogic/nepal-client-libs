/**
 * @file Holds the interfaces for elaborations after it has been "massaged"
 */

export interface ProtocolDecode {
// todo: maybe spec this out
    [s:string]:{ [s:string]:any };
}

export interface ElaborationInterface {

    ___incidentId?:string;

    __description:string;
    __normalizedTime?:string;
    __source?:string;
    __uuid:string;
    __messageId?:string;
    id?:{ account:string; aid:string; msgid:string };
    customer_id?:number;
    dest_addr?:string;
    eth_dst_addr?:string;
    eth_src_addr?:string;
    ip_chksum?:number[];
    ip_dg_len?:number;
    ip_flags?:number;
    ip_id?:number;
    ip_length?:number;
    ip_offset?:number;
    ip_tos?:number;
    ip_ttl?:number;
    ip_version?:number;

    event_id?:number;

    message?:string;

    payload?:string[];
    protocol_decodes?:{[i:string]:any}[];

    repeat_count?:number;
    response_event?:number;
    sensor_id?:number;
    signature_generator?:number;
    signature_id?:number;
    snort_event_id?:number;
    snort_pid?:number;
    snort_reference?:number;
    source_addr?:string;
    __tokens?:Token[];
    ts?:number;
    ts_us?:number;

    pinned:boolean; // added by ui
    reason:string; // added by ui

    Analysis?:{ event_intel:Array<{ attack:string }> }; // not sure if these are used
    undetected_referrer_samples?:Array<{ sha256:string }>;  // not sure if these are used

    __snortInfo?:SnortInfo;
    __tessaIntel?:any;
    __criticality:Criticality;
    __appliance_name?:string;

    // not sure if these are used
    host?:string;
    dst?:string;
    __packetCount?:number;
    http_code?:number;
    httpResponse?:number;
    Signature?:{ signature_name:string };
    signature_name?:string;
    verbose_msg?:string;
    rulename?:string;
    source_id?:string;
    src?:string;
    __irisType:string;
    ioc?:any; // todo: type this out
    packets?:any; // todo type this out

    __gzipDecode:GzipDecodeRaw[];

    __protoFacets?:{
        dst:string[];
        dstport:string[];
        protocols:string[];
        responseCode:string[];
        src:string[];
        srcport:string[];
    };

    grades?:{
        error?:string;
        kbd_severity?:number;
        kbd_confidence?:number;
    };

    result:string; // This is for AnalystAssist


    home_net:Homenet[];
}

export interface Homenet {
    address:string[];
    host_id:string;
    type:string;
}


export interface GzipDecodeRaw {
    header:string;
    value:string;
    order?:Array<{number:number; packet:number; type:string}>;
}


export type Criticality =
    CriticalityLow
    | CriticalityNeutral
    | CriticalityHigh
    | null
    | 'upgrade'
    | 'downgrade'
    | 'none';
export type CriticalityLow = -1;
export type CriticalityNeutral = 0;
export type CriticalityHigh = 1;

export interface SnortInfo {
    [index:string]:string;

    al_id:string;
    dest_ip:string;
    dest_port:string;
    protocol:string;
    raw:string;
    revision:string;
    signature_id:string;
    snort_msg:string;
    src_ip:string;
    src_port:string;
}

export interface ElaborationForIncTbl extends ElaborationInterface {

    n_ts:number;
    n_pktCnt:number;
    n_ioc:number;
    n_http:number;
    n_sev:number;
    n_conf:number;

}

export interface TimeSpanObj {
    minTicks:number;
    maxTicks:number;
}

export interface IncidentTable {
    events:ElaborationForIncTbl[];
    timespan?:TimeSpanObj;
    msgIds?:{[i:string]:boolean};
}

export interface Token {
    description:string;
    tokenName:string;
    value:string | string[];
}
