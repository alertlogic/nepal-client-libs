
import { AlChangeStamp } from '@al/core';

export type ConvergenceQueryParams = { [i: string]: string | number | boolean };

export type PolicyType = 'eventlogs'
                        | 's3'
                        | 'flatfile'
                        | 'assignment'
                        | 'monitoring'
                        | 'host'
                        | 'syslog'
                        | 'updates'
                        | 'whitelist';

export type LookedUpUsersResponse = { users: { [id: string]: UserData } };

export type CollectionFiltersResponse = { filters: CollectionFilter[] };

export type CollectionFilterValue = ICollectionFilterValue | string;

export type ZoneMembershipResponse = { zoneMembership: ApplianceZoneRecord[] };

export interface CloudExplorerAwsRegionRecord {
    id: string;
    name: string;
}

export interface ApplianceZoneRecord {
    zone_id?: string;
    name?: string;
}

export interface CollectionsGenericResponse {
    credentials?: { credential: CollectionCredential }[];
    policies?: { policy: CollectionPolicy }[];
    schedules?: { schedule: CollectionSchedule }[];
    sources?: { source: CollectionSource }[];
    collectors?: { source: CollectionSource }[];
    hosts?: { source: CollectionSource }[];
    networks?: { source: CollectionSource }[];
    keypairs?: { keypair: CertificateKeyPair }[];
    history?: CollectionHistory[];
    total_count?: number;
}

export interface CollectionSchedule {
    blackout?: CollectionScheduleBlackout;
    name?: string;
    id?: string;
    timezone?: string;
    created?: AlChangeStamp;
    modified?: AlChangeStamp;
}

export interface CollectionScheduleBlackout {
    enabled?: boolean;
    periods?: CollectionScheduleBlackoutPeriod[];
}

export interface CollectionScheduleBlackoutPeriod {
    start_minute?: string;
    start_hour?: string;
    end_minute?: string;
    end_hour?: string;
}

export interface CollectionHistory {
    key?: string;
    timestamp?: number;
    metadata?: CollectionHistoryMetadata;
    status?: CollectionHistoryStatus;
    details?: CollectionHistoryDetail[];
}

export interface CollectionHistoryDetail {
    status?: string;
    error?: string;
    warning?: string;
}

export interface CollectionHistoryMetadata {
    host_type?: string;
    local_hostname?: string;
    local_ipv4?: string[];
    local_ipv6?: string[];
    public_hostname?: string;
    public_ipv4?: string[];
    public_ipv6?: string[];
    num_logical_processors?: number;
    os_details?: string;
    os_type?: string;
    total_mem_mb?: number;
    version?: string;
    ec2_instance_id?: string;
    ec2_ami_id?: string;
    ec2_instance_type?: string;
    ec2_account_id?: string;
    ec2_region?: string;
    ec2_availability_zone?: string;
    sqs_endpoint?: string;
    sqs_queue_name?: string;
}

export interface CollectionCredential {
    created?: AlChangeStamp;
    modified?: AlChangeStamp;
    id?: string;
    name?: string;
    type?: string;
    password?: {
        password: string,
        username: string
    };
    iam_role?: {
        arn: string,
        external_id: string
    };
    azure_shared_key?: {
        account_key: string,
        account_name: string
    };
    azure_ad_user?: {
        active_directory_id: string,
        username: string
    };
}


export interface CollectionPolicy {
    id?: string;
    name?: string;
    type?: string;
    product_type?: string;
    collect_from_discovered?: boolean;
    default?: boolean;
    streams?: any[];
    created?: AlChangeStamp;
    modified?: AlChangeStamp;
    template_id?: string;
    alert_type?: string;
    target_type?: string;
    enabled?: boolean;
    when?: string;
    time_zone?: string;
    netmask?: string;
    restrict_network?: boolean;
    whitelist?: { rules?: WhiteListConfigRule[], policy?: { id?: string, name?: string } };
    monitoring?: MonitoringConfig;
    s3?: S3Config;
    tmhost?: HostConfig;
    flatfile?: FlatFileConfig;
    appliance_assignment?: ApplianceAssignmentConfig;
    collection_alert?: CollectionAlertConfig;
    schedule?: UpdatesScheduleConfig[];
    credential?: any;
}

export interface HostConfig {
    policyId?: string;
    name?: string;
    defaultState?: any;
    createdBy?: string;
    createdDate?: string;
    updatedBy?: string;
    updatedDate?: string;
    udp?: boolean;
    packet_size?: number;
    encrypt?: boolean;
    compress?: boolean;
}

export interface MonitoringConfig {
    networks: { id: string }[];
    whitelists: { id: string }[];
}

export interface ApplianceAssignmentConfig {
    appliances?: string[];
    secondary_appliances?: string[];
}

export interface WhiteListConfigRule {
    cidr?: string;
    port?: string;
    proto?: string;
}

export interface UpdatesScheduleConfig {
    days?: CollectionUpdatesPolicyScheduleDaysConfig;
    time?: CollectionUpdatesPolicyScheduleTimeConfig[];
}

export interface CollectionUpdatesPolicyScheduleDaysConfig {
    how: string;
    weekly?: string[];
    monthly?: number[];
}


export interface CollectionUpdatesPolicyScheduleTimeConfig {
    from: TimeConfig;
    to: TimeConfig;
}

export type TimeConfig = { hour: number, minute: number };

export interface FlatFileConfig {
    filename_integer_pattern?: string;
    filename_timestamp_pattern?: string;
    multiline?: MultilineConfig;
    name?: string;
    path?: string;
    timestamp?: TimestampConfig;
}

export interface CollectionAlertConfig {
    alert_threshold?: number;
    emails?: string[];
    is_enabled?: boolean;
    send_once?: boolean;
    send_threshold?: number;
}

export interface S3Config {
    multiline?: MultilineConfig;
    timestamp?: TimestampConfig;
}

export interface MultilineConfig {
    continuation?: string;
    is_multiline?: boolean;
    is_regex?: boolean;
    line_count?: string;
    operator?: string;
    pattern?: string;
}

export interface TimestampConfig {
    format?: string;
    rule?: string;
}

export interface CollectionSource {
    source?: CollectionSourceValue;
    host?: CollectionSourceValue;
    is_archived?: boolean;
}

export interface CollectionSourceValue {
    network_id?: string;
    registered?: boolean;
    role?: boolean;
    collection_alerts?: string[];
    config?: CollectionSourceConfig;
    created?: AlChangeStamp;
    modified?: AlChangeStamp;
    customer?: {
        id: string;
    };
    enabled?: boolean;
    host?: {
        id: string;
        ip_address?: string;
    };
    appliance?: any;
    id?: string;
    name?: string;
    product_type?: string;
    stats?: {
        [k: string]: number;
    };
    status?: CollectionHistoryStatus;
    tags?: {
        name: string;
    }[];
    type?: string;
    metadata?: CollectionHistoryMetadata;
    assignmentPolicy?: {
        id: string;
    };
    update_policy?: any;
    deployment?: any;
    monitoring?: { policy?: { id?: string, name?: string } };
    timestamp?: AlChangeStamp;
    whitelist?: any;
}

export interface CollectionHistoryStatus {
    details?: any[];
    status?: string;
    timestamp?: number;
    updated?: number;
    stream?: string;
    reported_by?: string;
    inst_type: string;
    host_id?: string;
}

export interface CollectionSourceConfig {
    collection_method?: string;
    template_id?: string;
    collection_type?: string;
    network?: {
        address: string;
    };
    policy?: {
        id?: string,
        name?: string
    };
    azure_events?: {
        credential?: any,
        filters?: any[],
        subscription_id?: string
    };
    azure_table?: {
        table_name?: string,
        credential?: any
    };
    azure_blob?: {
        app_service_name?: string,
        credential?: any,
        config_type?: string,
        container?: string
    };
    time_zone?: string;
    max_collection_interval?: string;
    s3aws?: any;
    s3?: any;
    tmappliance?: any;
}

export interface UserData {
    customer_name: string;
    email: string;
    first_name: string;
    full_name: string;
    last_name: string;
    user_id: string;
    username: string;
}

export interface CollectionFilter {
    field?: string;
    name: string;
    product: string[];
    type: string;
    values: CollectionFilterValue[];
}

export interface ICollectionFilterValue {
    name?: string;
    product?: string;
    value?: string;
}

export interface CertificateKeyPair {
    id?: string;
    certificate?: string[];
    private_key?: string[];
    encrypted_private_key?: string;
    name?: string;
    type?: string;
    created?: AlChangeStamp;
    modified?: AlChangeStamp;
    _certificate?: string;
    _private_key?: string;
}




