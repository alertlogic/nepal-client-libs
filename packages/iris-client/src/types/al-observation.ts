
export class AlObservation {
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

    static import(raw:any): AlObservation {
        const ob:AlObservation = Object.assign(new AlObservation(), raw);
        ob.accountId = raw.account_id;
        ob.customerName = raw.customer_name;
        ob.startTs = raw.start_ts;
        ob.endTs = raw.end_ts;
        ob.time = new Date(ob.ts * 1000);
        ob.__description = ob.summary;


        return ob;

    }
}

export interface ObservationParents {
    facts_count:        number;
    observations_count: number;
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

// Observation wasnt being exported in the js code for some reason
const ignoreMe = new AlObservation();
