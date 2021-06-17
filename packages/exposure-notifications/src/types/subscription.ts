import { AlHeraldAccountSubscriptionPayloadV2 } from '@al/herald';
import { AlAuditObject } from './auditObject';
import { AlNotificationPolicy } from './notificationPolicy';
/**
 * Subscription definition
 */
export interface Subscription {
    readonly id?: string;
    readonly created?: AlAuditObject;
    subscription: AlHeraldAccountSubscriptionPayloadV2;
    notification_policy: AlNotificationPolicyId | AlNotificationPolicy | null;
}

export interface AlNotificationPolicyId {
    id: string;
}
