import { AlChangeStamp } from '@al/core';

/**
 * Reexport AIMS constructs that are defined in @al/core for convenience.
 */
export { AIMSAccount, AIMSAuthentication, AIMSSessionDescriptor, AIMSUser, AlChangeStamp } from '@al/core';

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

export interface AlHeraldOptionV2 {
    email_subject ?: string;
    webhook_payload ?: string;
    include_attachments ?: boolean;
}

export interface AlHeraldSubscribersV2 {
    subscriber : string; // uuid
    subscriber_type:  "user" | "integration" | "connection" | "response.playbook";
    subscription_id: string;
    id: string;
    action?: 'delete' | 'add';
 }

export interface AlHeraldAccountSubscriptionPayloadV2
{
    name: string;
    class?: string;
    external_id ?: string; // Required when class is schedule
    notification_type: string;
    suppression_interval?: number;
    id?: string;
    active: boolean;
    options ?: AlHeraldOptionV2; // "email_subject",  webhook_payload
    filters ?: Object;
    subscribers ?: AlHeraldSubscribersV2[];
    template?: string;
}

export interface AlHeraldUpdateSubscriptionPayloadV2
{
    name ?: string;
    notification_type ?: string;
    active ?: boolean;
    options ?: AlHeraldOptionV2; // "email_subject",  webhook_payload
    filters ?: Object;
}

export interface AlHeraldAccountSubscriptionV2 extends AlHeraldAccountSubscriptionPayloadV2
{
    id: string;
    account_id: string;
    display_name?: string;
    created: AlChangeStamp;
    modified: AlChangeStamp;
    last_notification: number;
}

export interface AlHeraldAccountSubscriptionResponseV2 extends AlHeraldAccountSubscriptionPayloadV2
{
    id: string;
    account_id: string;
    created: AlChangeStamp;
    subscribers_failed ?: AlHeraldSubscribersV2[];
}

export interface AlHeraldSubscriptionsKeyByAccountsRecord
{
    account_ids: string[];
    subscriptions: AlHeraldSubscriptionRecord[];
}

export interface AlHeraldIntegrationBasePayload{
    name: string;
    type?: string;
}

export interface AlHeraldIntegrationWebhookPayload extends AlHeraldIntegrationBasePayload{
    name: string;
    target_url?: string;
    headers?: object;
}

export interface AlHeraldIntegrationEmailPayload extends AlHeraldIntegrationBasePayload{
    name: string;
    email?: string;
}

export interface AlHeraldIntegrationJiraPayload extends AlHeraldIntegrationBasePayload{
    name: string;
    email?: string;
    api_token?: string;
    reporter_id?: string;
    jira_domain?: string;
    project?: string;
}

export interface AlHeraldIntegration extends AlHeraldIntegrationWebhookPayload, AlHeraldIntegrationEmailPayload, AlHeraldIntegrationJiraPayload
{
    id?: string;
    account_id?: string;
    created?: AlChangeStamp;
    modified?: AlChangeStamp;
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
    feature?: string;
    subkey?: string;
    data?: AlHeraldNotificationData;
    attachments?: AlHeraldNotificationAttachment[];
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

export interface AlHeraldNotificationIncidentByIncidentId
{
    id: string;
    feature: string;
    subkey: string;
    subject: string;
    statuses: AlHeraldNotificationStatuses[];
    integration_statuses?: AlHeraldNotificationIntegrationStatuses;
}

export interface AlHeraldTemplateMapPayload
{
    feature: string;
    subkey_part: string;
    template_name?: string;
    template_id?: string;
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
    data?: unknown;
    headers?: unknown;
}

export interface AlHeraldTestEmailPayload
{
    email: string;
}

export interface AlHeraldTestWebhookResponse
{
    rawbody: string;
    code: number;
}

export interface AlHeraldTestJiraPayload
{
    email: string;
    api_token: string;
    reporter_id: string;
    jira_domain: string;
    project: string;
    id?:string;
}

export interface AlHeraldTestTemplatePayload{
    template_name: string;
    email: string;
    attachments: AlHeraldNotificationAttachment[];
}

export interface ALHeraldSubscriber {
    subscriber: string;
    subscriber_type: "user" | "webhook" | "all";
}

export interface AlHeraldNotificationType {
    notification_type: string;
    name: string;
    default_template: string;
    templates: string[];
    default_email_subject: string;
}

export interface AlHeraldNotificationV2 extends AlHeraldNotificationPayload
{
    id?: string;
    account_id?: string;
    type: string;
    message_id?: string;
    integration_message_ids?: string[];
    notification_data: AlHeraldNotificationDataV2;
    asset_data: AlHeraldAssetData;
    payload: AlHeraldNotificationDataIncident;
    status?: string;
    created?: AlChangeStamp;
    modified?: AlChangeStamp;
}

export interface AlHeraldNotificationDataV2 {
    class: string;
    threat_level: string;
    attackers: string[];
    targets: string[];
    status: string;
    appliance: string;
    detection_source: string;
}

export interface AlHeraldAssetData {
    deployment_id: string;
    tags: AlPairValues[];
    tag_keys: AlPairValues[];
}

export interface AlPairValues {
    key: string;
    value: string;
}

export interface AlHeraldNotificationByAccountId {
    notifications: AlHeraldNotificationByAccountData[];
    total_count: number;
    continuation_id: string;
}

export interface AlHeraldNotificationByAccountData {
    id: string;
    account_id: string;
    feature: string;
    subkey: string;
    status: string;
    data: AlHeraldNotificationDataByAccountId;
    message_id: string;
    integration_message_ids: string[];
    created: AlChangeStamp;
    modified: AlChangeStamp;
}

export interface AlHeraldNotificationDataByAccountId {
    service_owners: string;
    put: string;
    they: string;
    in: string;
    it: string;
    goes: string;
    whispir: boolean;
}

export interface AlHeraldSubscriptionsQueryV2
{
    class?: string; // Class name
    external_id?: string; // external_id of subscriptions. When present, class=schedule is assumed
    notification_type?: string; // Notification type
    include_subscribers?: boolean;
}

export interface AlHeraldSubscribedFailedV2 {
    details?:string[];
    error?: string;
    subscriber?: string;
    subscriberType?: string;
}

export interface AlHeraldSubcriptionErrorV2 {
    status?: number;
    statusText?: string;
    data?:{
        subscribers_failed?:AlHeraldSubscribedFailedV2[];
    };
}
