/**
 * Module to deal with available Ticket Master Public API endpoints
 */
import {
  AlApiClient,
  AlDefaultClient,
} from '@al/core';

export interface AetherResult {
    id?: string;
    fields?: {
        impact?: string;
        engine?: string;
        cvss_vector?: string;
        description?: string;
        cpe_names?: string[];
        origin_id?: string;
        pci_exception_reason?: string;
        resolution?: string;
        name?: string;
        pci_severity?: string;
        last_modified?: string;
        supported_platforms?: string[];
        cvss_score?: string;
        cve?: string;
        cwe?: string;
        reference?: string;
        severity?: string;
        cvss_scores_list?: string[];
    };
}

export interface AetherSearchResponse {
    status?: {
        rid?: string;
        'time-ms'?: number;
    };
    hits?: {
        found?: number;
        start?: number;
        cursor?: string;
        hit?: AetherResult[];
    };
    facets?: {
        [property: string]: {
            value: string;
            count: number;
        }[];
    };
}

export class AetherClientInstance {
    private serviceName = 'aether';

    public constructor(public client: AlApiClient = AlDefaultClient) {
    }

    /**
     * Exposures Search
     * POST
     * /aether/exposures/2013-01-01/search
     * "https://api.cloudinsight.alertlogic.com/aether/exposures/2013-01-01/search"
     *
     * Please note that this is a provisional method and subject to imminent change.
     *
     * @param query The search string, or null.
     * @param advanced Optional, configuration parameters for sorting, paging & criteria
     */
    public async search(query: string,
                        advanced?: { parser?: string, options?: string, size?: number,
                                     sort?: string, start?: number, format?: string,
                                     cursor?: string, fq?: string, facet?: string }): Promise<AetherSearchResponse> {
        const queryParams = Object.entries({ q: query, ...advanced })
            .map(([parameter, value]) => `${parameter}=${value.toString()}`)
            .join(`&`)
            .replace(`&facet=`, `&`)
            .replace(`&parser=`, `&q.parser=`);

        return this.client.post<AetherSearchResponse>({
            service_name: this.serviceName,
            path: '/exposures/2013-01-01/search',
            version: null,
            data: `${queryParams}`
        });

    }
}
