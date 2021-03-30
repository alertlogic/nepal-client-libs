import {
    AlApiClient,
    AlDefaultClient,
    AlLocation
} from '@al/core';

import { AlAssetsManagerReportSummary,
         AlAssetsManagerReportSummaryQueryParams  } from './types';

export class AlAssetsManagerClientInstance {
    client: AlApiClient;
    private readonly serviceName: string = 'assets-manager';
    private readonly version: string = 'v1';

    constructor(client?: AlApiClient) {
        this.client = client || AlDefaultClient;
    }

    async getReportSummary(accountId: string,
                           deploymentId: string,
                           qParams: AlAssetsManagerReportSummaryQueryParams): Promise<AlAssetsManagerReportSummary> {
        return this.client.get<AlAssetsManagerReportSummary>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.version,
            account_id: accountId,
            path: `/deployments/${deploymentId}/reports/summary`,
            params: qParams
        });
    }

}

