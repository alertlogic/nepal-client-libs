import { AlChangeStamp, AIMSAuthentication, AIMSUser, AIMSAccount, AIMSSessionDescriptor } from '@al/client';

/**
 * Reexport AIMS constructs that are defined in @al/session for convenience.
 */
export { AlChangeStamp, AIMSAuthentication, AIMSUser, AIMSAccount, AIMSSessionDescriptor } from '@al/client';

export interface AlHeraldSubscriptionKey
{
    feature: string;
    subkey: string;
    name: string;
    created?: AlChangeStamp;
    modified?: AlChangeStamp;
}

export interface ALHeraldSubscriptionRecord
{
    feature: string;
    subkey?: string;
    name?: string;
    subscribed: boolean;
}

export interface ALHeraldSubscriptionsKeyByAccountRecord
{
    account_id: string;
    subscriptions: ALHeraldSubscriptionRecord[];
}

export interface ALHeraldAccountSubscription
{
    subscriber_type: string;
    user_id: string;
    accounts: ALHeraldSubscriptionsKeyByAccountRecord[];
}

export interface AlHeraldIntegrationPayload{
    name: string;
    target_url: string;
}

export interface AlHeraldIntegration
{
    id: string;
    account_id: string;
    target_url: string;
    name: string;
    type: string;
    created: AlChangeStamp;
    modified: AlChangeStamp;
}

export interface AlHeraldIntegrationTypes
{
    name: string;
}

export interface AlHeraldNotificationDataBase{
    whispir?: boolean;
    tld?: string;
}

export interface AlHeraldNotificationDataEndpoints extends AlHeraldNotificationDataBase{
    detail_url?: string;
    device_name?: string;
    device_tags?: string;
    device_user_name?: string;
    process_name?: string;
    process_path?: string;
    rule_name?: string;
    subject?: string;
}

export interface AlHeraldNotificationDataSearch extends AlHeraldNotificationDataBase{
    account_id?: string;
    domain?: string;
    query_id?: string;
    result_count?: string;
    schedule?: string;
    search_id?: string;
    search_name?: string;
    time?: string;
    time_range?: string;
    time_range_end_ts?: string;
    time_range_start_ts?: string;
}

export interface AlHeraldNotificationDataIncident extends AlHeraldNotificationDataBase{
    analyst_notes?: string;
    attack_summary?: string;
    cid?: string;
    class?: string;
    create_date?: string;
    customer_name?: string;
    deployment_name?: string;
    incident_id?: string;
    investigation_report?: string;
    location_ip?: string;
    long_incident_id?: string;
    recommendations?: string;
    start_date?: string;
    status?: string;
    target_host?: string;
    threat?: string;
}

export interface AlHeraldNotificationData{
    [key: string]: unknown
    | AlHeraldNotificationDataBase
    | AlHeraldNotificationDataEndpoints
    | AlHeraldNotificationDataSearch
    | AlHeraldNotificationDataIncident;
}

export interface AlHeraldNotificationAttachment{
    name: string;
    description: string;
    url: string;
}

export interface AlHeraldNotification
{
    id: string;
    account_id?: string;
    feature: string;
    subkey: string;
    status: string;
    data: AlHeraldNotificationData;
    message_id?: string;
    integration_message_ids?: string[];
    attachments ?: AlHeraldNotificationAttachment;
    created: AlChangeStamp;
    modified: AlChangeStamp;
}

export interface AlHeraldNotificationPayload
{
    feature: string;
    subkey: string;
    data: AlHeraldNotificationData;
    attachments:AlHeraldNotificationAttachment[];
}

export interface AlHeraldNotificationQuery
{
    since?: string; // Show items created since
    until?: string; // Show items created until
    limit?: number;	// Controls the maximum number of items per page. Works only if pagination is enabled.
    continuation_id?: string;
}

export interface AlHeraldNotificationList
{
    notifications: AlHeraldNotification[];
    continuation_id: string;
    total_count: number;
}

export interface AlHeraldNotificationIntegrationStatuses
{
    integration_id: string;
    status: "QUEUED" | "SENT";
    queue_data: any;
    integration_response?: any;
}

export interface AlHeraldNotificationStatuses
{
    destination: string;
    status: "PENDING" | "SENT" | "DELIVRD" | "READ" | "FAILED";
    sent_at: number;
}

export interface AlHeraldNotificationIncident extends AlHeraldNotification
{
    integration_statuses?: AlHeraldNotificationIntegrationStatuses;
    statuses?: AlHeraldNotificationStatuses[];
}
