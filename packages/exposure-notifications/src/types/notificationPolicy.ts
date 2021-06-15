import { AlAuditObject } from "./auditObject";

/**
 *  Notification Policy definition
 */
export interface AlNotificationPolicy {
    readonly id: string;
    readonly name?: string;
    readonly schedule: SchedulePolicy;
    readonly created?: AlAuditObject;
}

export interface SchedulePolicy {
    readonly delay: number;
}
