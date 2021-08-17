
/* tslint:disable:variable-name prefer-array-literal */
import { Elaboration } from './elaboration.class';

export class ElaborationEvent extends Elaboration {

    public dst:string = "";
    public event_id:number;
    public payload:string[] = [];
    public appliance:string;
    public gzipDecode:Array<{
        header:string;
        order?:Array<{
            number:number;
            packet:number;
            type:'req'|'res';
        }>;
        value:string;
    }> = [{
        header: "",
        value: "",
    }];
    public protocol_decodes:Array<{[i:string]:any}> = [];
    public application_payload:string[] = [];
    public sig_id:number;
    public src:string = "";
    public ts:number;
    public snortInfo = {
        al_id: 0,
        dest_ip: "None",
        dest_port: "None",
        protocol: "None",
        raw: "no snort info available",
        revision: "0",
        signature_id: "0",
        snort_msg: "no snort info available",
        src_ip: "none",
        src_port: "none",
    };

    public protoFacets:{ [i:string]:string[] };
    public ip_proxy:string = "";
    public ip_proxy_client:string = "";

    constructor() {
        super();
    }

    public static deserialize(raw:any):  ElaborationEvent {
        const elaboration = new ElaborationEvent();
        if (raw.hasOwnProperty('dst')) {
            elaboration.dst = raw.dst;
        }
        if (raw.hasOwnProperty('application_payload')) {
            elaboration.application_payload = raw.application_payload;
        }
        if (raw.hasOwnProperty('__appliance_name')) {
            elaboration.appliance = raw.__appliance_name;
        }
        if (raw.hasOwnProperty('event_id')) {
            elaboration.event_id = raw.event_id;
        }
        if (raw.hasOwnProperty('payload')) {
            elaboration.payload = raw.payload;
        }
        if (raw.hasOwnProperty('__gzipDecode')) {
            elaboration.gzipDecode = raw.__gzipDecode;
        }
        if (raw.hasOwnProperty('protocol_decodes')) {
            elaboration.protocol_decodes = raw.protocol_decodes;
        }
        if (raw.hasOwnProperty('sig_id')) {
            elaboration.sig_id = raw.sig_id;
        }
        if (raw.hasOwnProperty('src')) {
            elaboration.src = raw.src;
        }
        if (raw.hasOwnProperty('ts')) {
            elaboration.ts = raw.ts;
        }
        if (raw.hasOwnProperty('__snortInfo')) {
            elaboration.snortInfo = raw.__snortInfo;
        }

        if (raw.hasOwnProperty('__protoFacets')) {
            elaboration.protoFacets = raw.__protoFacets;
        }
        if (raw.hasOwnProperty('ip_proxy')) {
            elaboration.ip_proxy = raw.ip_proxy;
        }
        if (raw.hasOwnProperty('ip_proxy_client')) {
            elaboration.ip_proxy_client = raw.ip_proxy_client;
        }
        if (raw.hasOwnProperty('__messageId')) {
            elaboration.messageId = raw.__messageId;
        }
        return elaboration;
    }
}
