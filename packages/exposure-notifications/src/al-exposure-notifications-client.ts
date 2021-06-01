/**
 * Module to deal with available Exposure Notifications Public API endpoints
 */
import {
    AlDefaultClient,
    AlResponseValidationError,
    AlLocation
} from '@al/core';

import {
    AlAssignment,
    AlNotificationPolicy
} from './types/models';

export class AlExposureNotificationsInstanceClient {

    private serviceName = 'exposure_notifications';

    /**
     *  Lists available notification policies for a given account id
     */
    async getNotificationPolicies(accountId: string): Promise<AlNotificationPolicy[]> {
        return AlDefaultClient.get({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: 1,
            account_id: accountId,
            path: `/notification_policies`
        });
    }

    /**
     *  Gets a notification policy for a given policy id
     */
    async getNotificationPolicy(accountId: string, policyId: string): Promise<AlNotificationPolicy> {
        return AlDefaultClient.get({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: 1,
            account_id: accountId,
            path: `/notification_policies/${policyId}`
        });
    }

    /**
     *  Lists available notification rules
     */
    async getNotificationRules(): Promise<{ [filterName: string]: string[] }[]> {
        return AlDefaultClient.get({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: 1,
            path: `/filters`
        });
    }

    /**
     *  Creates new Assignment for a given account id
     */
    async createAssignment(accountId: string, assignment: AlAssignment): Promise<AlAssignment> {
        const result = await AlDefaultClient.post({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: 1,
            account_id: accountId,
            path: `/assignments`,
            data: assignment
        });
        if (!result.hasOwnProperty("id")) {
            throw new AlResponseValidationError(`Service returned unexpected result; missing 'id' property.`);
        }
        return result;
    }

    /**
     *  Lists assignments for a given account id
     */
    async getAssignments(accountId: string): Promise<AlAssignment[]> {
        return AlDefaultClient.get({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: 1,
            account_id: accountId,
            path: `/assignments`
        });
    }

    /**
     *  Gets an assignment for a given assignment id
     */
    async getAssignment(accountId: string, assignmentId: string): Promise<AlAssignment> {
        return AlDefaultClient.get({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: 1,
            account_id: accountId,
            path: `/assignments/${assignmentId}`
        });
    }

    /**
     *  Deletes an Assignment
     */
    async removeAssignment(accountId: string, assignmentId: string) {
        return AlDefaultClient.delete({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: 1,
            account_id: accountId,
            path: `/assignments/${assignmentId}`
        });
    }
}
