/**
 * Module to deal with available Correlations Public API endpoints
 */
import {
    AlDefaultClient
} from '@al/core';

// Type to handle data types as an explicit one
export type AlMessageDataType = 'logmsgs'|'observation'|'idsmsgs'|'fimdata';

export interface AlMessageDetailsMetaData {
    qingest_id: string;
    account: number;
    aid: number;
    msgid: string;
}

export interface AlReadMessageDetailsResponse {
    id: AlMessageDetailsMetaData;
    fields: AlLogMessageFields | AlIdsMessageFields | AlFimDataFields | AlObservationFields;
}

export interface AlLogMessageFields {
    time_recv: number;
    hostname: string;
    facility: string;
    message: string;
    parsed: {
        rule_id: string;
        rule_name: string;
        pattern_id: string;
        tokens: { [key: string]: string };
    };
    metadata: {
        uuid: string;
        create_ts: number;
        dict: {
            hostname: string;
            public_hostname: string;
            instance_id: string;
            ip_addr: string;
            public_ip_addr: string;
            os: string;
            os_version: string;
            os_arch: string;
            os_machine: string;
        }
    };
    prioriy: number;
    program: string;
}

export interface AlFlags {
    urg: boolean;
    syn: boolean;
    rst: boolean;
    psh: boolean;
    ns: boolean;
    fin: boolean;
    ece: boolean;
    cwr: boolean;
    ack: boolean;
    mf?: boolean;
    df?: boolean;
}

export interface AlProtocol {
    winsize: number;
    urgent: number;
    srcport: number;
    seq: number;
    options: string;
    offset: number;
    id: string;
    flags: AlFlags;
    dstport: number;
    data_off: number;
    checksum: number;
    ack: number;
    ttl?: number;
    total_length?: number;
    srcip: string;
    ident?: number;
    header_len?: number;
    frag_offset?: number;
    ecn?: number;
    dstip: string;
    diffserv?: number;
    srcmac: string;
    dstmac: string;
}

export interface AlProto {
    srcport: number;
    protocols: AlProtocol[];
    protocol: number;
    offset: number;
    ip_src: string;
    ip_dst: string;
    dstport: number;
}

export interface AlPayload {
    proto: AlProto;
    data: string;
    hex: string;
    ascii: string;
    ts: number;
    ts_us: number;
}

export interface AlIdsMessageFields {
    asset: AlAsset;
    vlan?: number;
    ts_us: number;
    ts: number;
    srcport: number;
    signature: { [key: string]: unknown };
    sig_rev: number;
    sig_id: number;
    sig_gen: number;
    proto: number;
    priority: number;
    payload: AlPayload[];
    orig?: boolean;
    mpls?: number;
    ip_src: string;
    ip_proxy_client?: string;
    ip_proxy?: string;
    ip_dst: string;
    ingest_ts: number;
    ingest_id: string;
    event_id: number;
    dstport: number;
    class: number;
    asset_id: string;
}

export interface AlAsset {
    dict: { [key: string]: unknown };
    data: string;
    asset_id: string;
}

export interface AlFimDataFields {
    ts: number;
    sha1_hash: string;
    path: string;
    ingest_ts: number;
    ingest_id: string;
    host_id: string;
    file_type: string;
    file_size: number;
    file_permissions: number;
    file_owner: string;
    file_name: string;
    file_mtime: number;
    file_group: string;
    file_ctime: number;
    file_attributes: number;
    file_atime: number;
    event_type: string;
    asset: AlAsset;
}

export interface AlObservationFields {
    visibility: string;
    ts: number;
    technique?: string;
    tactic?: string;
    summary: string;
    subclass: string;
    sub_technique?: string;
    start_ts: number;
    severity: string;
    scope_type: string;
    scope: string[];
    recommendations: string;
    properties_data: string;
    properties: { [key: string]: any };
    path: string;
    parents: string[];
    keys_data: string;
    keys: { [key: string]: any };
    internal_data: string;
    internal: { [key: string]: any };
    ingest_ts: number;
    ingest_id: string;
    id: string;
    handling: string[];
    evolved_to?: string;
    end_ts: number;
    desc: string;
    confidence?: number;
    class: string;
    authority: string;
}

interface OptionalParams {
    fields?: string;
    return_type?: string;
}

export class AlMsgAccessClientInstance {

    private serviceName = 'msg_access';

    /**
     * Read Messages
     * Read a set of messages from storage by ID. Proxy for daccess service messages API. Only addition is logmsgs data type messages are also parsed and tokenised
     */
    async readMessagesGET(accountId: string, dataType: AlMessageDataType = 'logmsgs', queryParams: { ids: string, fields?: string, return_type?: string }): Promise<AlReadMessageDetailsResponse[]> {
        // Let's set up default query params in case they are not present (optional)
        Object.assign(queryParams, this.setOptionalParams(queryParams));

        return AlDefaultClient.get({
            service_name: this.serviceName,
            account_id: accountId,
            path: `/messages/${dataType}`,
            params: queryParams
        });
    }

    /**
     * Read Messages POST
     * Read a set of messages from storage by ID. Proxy for daccess service messages API. Only addition is logmsgs data type messages are also parsed and tokenised
     */
    async readMessagesPOST(accountId: string, dataType: AlMessageDataType = 'logmsgs', params: { ids: string[], fields?: string, return_type?: string }): Promise<AlReadMessageDetailsResponse[]> {
        // Let's set up default data params in case they are not present (optional)
        Object.assign(params, this.setOptionalParams(params));

        return AlDefaultClient.post({
            service_name: this.serviceName,
            account_id: accountId,
            path: `/messages/${dataType}`,
            data: params
        });
    }

    private setOptionalParams(params: OptionalParams): OptionalParams {
        // Let's set the fields default value
        // which is to get all of them
        if (!params.fields) {
            params.fields = '__all';
        }
        // and return_type = ui meaning returning data
        // transformed for presentations purposes
        if (!params.return_type) {
            params.return_type = 'ui';
        }

        return params;
    }
}
