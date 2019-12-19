import { AlChangeStamp, AIMSAuthentication, AIMSUser, AIMSAccount, AIMSSessionDescriptor } from '@al/client';

/**
 * Reexport AIMS constructs that are defined in @al/session for convenience.
 */
export { AlChangeStamp, AIMSAuthentication, AIMSUser, AIMSAccount, AIMSSessionDescriptor } from '@al/client';

export interface AlHeraldAccountSubscriptionKeyPayload
{
    feature: string;
    subkey: string;
    name: string;
}

export interface AlHeraldSubscriptionKeyPayload extends AlHeraldAccountSubscriptionKeyPayload
{
    mapped_subkey?: string;
    template_name: string;
}

export interface AlHeraldAccountSubscriptionKey extends AlHeraldSubscriptionKey
{
    account_id: string;
}

export interface AlHeraldSubscriptionKey extends AlHeraldAccountSubscriptionKeyPayload
{
    mapped_subkey?: string;
    created: AlChangeStamp;
    modified: AlChangeStamp;
}

export interface AlHeraldSubscriptionKeyQuery
{
    showAll?: boolean;
    subscriptionKeyType?: string;
}

export interface AlHeraldSubscriptionRecord
{
    feature: string;
    subkey?: string;
    name?: string;
    subscribed: boolean;
}

export interface AlHeraldSubscriptionsKeyByAccountRecord
{
    account_id: string;
    subscriptions: AlHeraldSubscriptionRecord[];
}

export interface AlHeraldAccountSubscription
{
    subscriber_type: string;
    user_id?: string;
    integration_id?: string;
    accounts: AlHeraldSubscriptionsKeyByAccountRecord[];
}

export interface AlHeraldSubscriptionsKeyByAccountsRecord
{
    account_ids: string[];
    subscriptions: AlHeraldSubscriptionRecord[];
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

export interface AlHeraldAccountByFeatureQuery {
    subscriber_type?: string;
}

export interface AlHeraldSubscriptionKeysByFeatureQuery {
    subscription_key_type: string;
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

export interface AlHeraldNotification extends AlHeraldNotificationPayload
{
    id: string;
    account_id?: string;
    status: string;
    message_id?: string;
    integration_message_ids?: string[];
    created: AlChangeStamp;
    modified: AlChangeStamp;
}

export interface AlHeraldNotificationPayload
{
    feature: string;
    subkey: string;
    data: AlHeraldNotificationData;
    attachments: AlHeraldNotificationAttachment[];
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

export interface AlHeraldTemplateMapPayload
{
    feature: string;
    subkey_part: string;
    template_name: string;
}

export interface AlHeraldTemplateMap extends AlHeraldTemplateMapPayload
{
    created: AlChangeStamp;
    modified: AlChangeStamp;
}

export interface AlHeraldTestWebhookPayload
{
    url: string;
    method: string;
    data: unknown;
}

export interface AlHeraldTestWebhookResponse
{
    rawbody: string;
    code: number;
}

export interface AlHeraldTestTemplatePayload{
    template_name: string;
    email: string;
    attachments: AlHeraldNotificationAttachment[];
}
