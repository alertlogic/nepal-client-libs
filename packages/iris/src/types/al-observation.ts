import { get } from 'lodash';

interface TimeNameMapping {
    time: string;
    name: string;
}

const TIME_NAME_PROPERTY_BY_PATH: Record<string, TimeNameMapping> = {
    "Endpoint/DigitalGuardian/AlarmObservation": {
        time: 'properties.create_time',
        name: 'properties.alarm_name'
    }
};

export class AlObservation {
    static readonly EPOCH_MULTIPLIER = 1000;

    evidenceType: string = 'observation';
    accountId:       number;
    aggregations:    unknown[];
    authority:       string;
    cid:             number;
    class:           string;
    customerName:   string;
    desc:            string;
    elaborations:    unknown[];
    endTs:          number;
    id:              string;
    keys:            ObservationKeys;
    parents:         ObservationParents;
    path:            string;
    properties:      ObservationProperties;
    recommendations: null;
    scope:           ObservationScope;
    severity:        string;
    startTs:         number;
    subclass:        string;
    summary:         string;
    time:            Date;
    ts:              number;
    type:            string;
    visibility:      string;
    // tslint:disable-next-line:variable-name
    __description:   string;

    constructor(raw: any) {
        Object.assign(this, raw);

        this.accountId = raw.account_id;
        this.customerName = raw.customer_name;
        this.startTs = raw.start_ts;
        this.endTs = raw.end_ts;
        this.initializeTimeAndSummary(raw);
    }

    private initializeTimeAndSummary(raw: any): void {
        if (raw.path in TIME_NAME_PROPERTY_BY_PATH) {
            const { time: timeProperty, name: nameProperty } = TIME_NAME_PROPERTY_BY_PATH[raw.path];
            const time = get(raw, timeProperty);
            const name = get(raw, nameProperty);
            this.time = new Date(time * AlObservation.EPOCH_MULTIPLIER);
            this.summary = name;
        } else {
            this.time = new Date(this.ts * AlObservation.EPOCH_MULTIPLIER);
            this.summary = this.summary || '';
        }
        this.__description = this.summary;
    }
}

export interface ObservationParents {
    facts_count:        number;
    observations_count: number;
    observation_data?: unknown[];
    facts?: unknown[];
}

export interface ObservationProperties {
    asn?:                    string;
    country:                 string;
    cwe:                     string;
    encoding?:               string;
    http_element:            string;
    ingest_host_id:          string;
    ingest_program:          string;
    ingest_rule_name:        string;
    outcome:                 string;
    raw_request:             string;
    request_id:              string;
    rule_confidence:         number;
    rule_id:                 string;
    socket_ip:               string;
    src_ip_confidence:       number;
    src_type:                string;
    src_type_confidence:     number;
    uri_path:                string;
    violating_element_value: string;
    violation_type:          string;
    virtual_host?:           string;
    x_forwarded_for:         string;
}

export interface ObservationScope {
}

export interface ObservationKeys {
    [key: string]: any & {enrichment_map?: {[key: string]: string[]}};
}
