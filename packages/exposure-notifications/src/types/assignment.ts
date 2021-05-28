import { AlAuditObject } from "./auditObject";

/**
 *  Definition for a Assignment
 */
export interface AlAssignment {
    policy_id: string;
    subscription_id: string;
    readonly id?: string;
    readonly created?: AlAuditObject;
}
