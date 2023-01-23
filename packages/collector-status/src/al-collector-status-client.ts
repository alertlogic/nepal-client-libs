/**
 * Collector status API client
 */
import { AlApiClient, AlDefaultClient, AlLocation } from "@al/core";
import {
    AlCollectorStatusHistoryResponse,
    AlCollectorStatusObject,
    AlCollectorStatusQueryParams,
} from "./types";

export class AlCollectorStatusClientInstance {
    protected client: AlApiClient;
    protected serviceVersion = "v1";
    protected serviceName = "collectors_status";

    constructor(client: AlApiClient = null) {
        this.client = client || AlDefaultClient;
    }

    /**
     * List, group and aggregate statuses
     * GET
     * /collectors_status/v1/{account_id}/statuses/{status_id}/history
     *
     * */
    async getCollectorStatusHistory(
        accountId: string,
        statusId: string,
        params?: AlCollectorStatusQueryParams
    ): Promise<Array<AlCollectorStatusObject>> {
        return this.client.get<Array<AlCollectorStatusObject>>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/statuses/${statusId}/history`,
            params: params,
        });
    }

    /**
     * Get last status
     * Returns last status by status_id, identical to the query /collectors_status/v1/{account_id}/statuses/{status_id}/history?limit=1
     * GET
     * /collectors_status/v1/{account_id}/statuses/{status_id}
     *
     * */
    async getCollectorLastStatus(
        accountId: string,
        statusId: string,
        params?: AlCollectorStatusQueryParams
    ): Promise<AlCollectorStatusHistoryResponse> {
        return this.client.get<AlCollectorStatusHistoryResponse>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/statuses/${statusId}`,
            params: params,
        });
    }

    /**
     * Report status
     * Endpoint for reporting status of a collector.
     * PUT
     * /collectors_status/v1/{account_id}/statuses/{status_id}/streams/{stream}
     *
     * */
    async reportCollectorStatus(
        accountId: string,
        statusId: string,
        stream: string,
        payload: AlCollectorStatusObject
    ): Promise<void> {
        return this.client.get<void>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/statuses/${statusId}/streams/${stream}`,
            data: payload,
        });
    }
}
