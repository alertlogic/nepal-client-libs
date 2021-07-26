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
    AlNotificationPolicy,
    AssetFilter,
    Subscription
} from './types/models';

export class AlExposureNotificationsInstanceClient {

    private serviceName = 'exposure_notifications';
    private serviceVersion = 1;

    /**
     *  Lists available notification policies for a given account id
     */
    async getNotificationPolicies(accountId: string): Promise<AlNotificationPolicy[]> {
        return AlDefaultClient.get({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
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
            version: this.serviceVersion,
            account_id: accountId,
            path: `/notification_policies/${policyId}`
        });
    }

    /**
     *  Lists available notification rules
     */
    async getNotificationRules(accountId: string): Promise<{ [filterName: string]: string[] | AssetFilter[] }[]> {
        return AlDefaultClient.get({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
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
            version: this.serviceVersion,
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
            version: this.serviceVersion,
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
            version: this.serviceVersion,
            account_id: accountId,
            path: `/assignments/${assignmentId}`
        });
    }

    /**
     *  Deletes an Assignment
     */
    async deleteAssignment(accountId: string, assignmentId: string): Promise<void> {
        return AlDefaultClient.delete({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/assignments/${assignmentId}`
        });
    }

    /**
     * Deletes subscription and policy assigned
     */
    async deleteSubscriptionAndPolicy(accountId: string, subscriptionId: string): Promise<void> {
        return AlDefaultClient.delete({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/facade/subscriptions/${subscriptionId}`
        });
    }

    /**
     * Updates subscription in Herald service and updates an assignment of
     * notification policy to subscription if changed. null as notification policy
     * will unassign policy.
     */
    async updateSubscription(accountId: string, subscriptionId: string, subscriptionBody: Subscription): Promise<void> {
        return AlDefaultClient.put({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/facade/subscriptions/${subscriptionId}`,
            data: subscriptionBody
        });
    }

    /**
     * Create a subscription and assign notification policy to it.
     * null as notification policy means no policy assigned.
     */
    async createSubscription(accountId: string, subscriptionBody: Subscription): Promise<Subscription> {
        const result: Subscription = await AlDefaultClient.post({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/facade/subscriptions`,
            data: subscriptionBody
        });
        if (!(result.hasOwnProperty("subscription")&&result.subscription.hasOwnProperty("id"))) {
            throw new AlResponseValidationError(`Service returned unexpected result; missing subscription.'id' property.`);
        }
        return result;
    }

    /**
     * Listed herald subscriptions with policies if assigned
     */
    async getSubscriptions(accountId: string): Promise<Subscription[]> {
        return AlDefaultClient.get({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/facade/subscriptions`
        });
    }

}
