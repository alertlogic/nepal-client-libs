/**
 * Module to deal with available Ticket Master Public API endpoints
 */
import { AlApiClient, ALClient } from '@al/client';

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
    };
}
export interface Bucket {
    value: string;
    count: number;
}
export interface FacetObject {
    buckets: Bucket[];
}
export interface AetherFacetResponse {
    [property: string]: FacetObject;
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
    facets?: AetherFacetResponse;
}

export class AetherClientInstance {
    private serviceName = 'aether';

    public constructor(public client: AlApiClient = ALClient) {
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
        advanced?: {
            parser?: string,
            options?: string,
            size?: number,
            sort?: string,
            start?: number,
            format?: string,
            cursor?: string,
            fq?: string,
            facet?: string
        }) {
        let queryParams = '';
        if (advanced && advanced.hasOwnProperty('parser')) {
            queryParams = queryParams.concat(`&q.parser=${advanced.parser}`);
        }
        if (advanced && advanced.hasOwnProperty('options')) {
            queryParams = queryParams.concat(`&options=${advanced.options}`);
        }
        if (advanced && advanced.hasOwnProperty('size')) {
            queryParams = queryParams.concat(`&size=${advanced.size.toString()}`);
        }
        if (advanced && advanced.hasOwnProperty('sort')) {
            queryParams = queryParams.concat(`&sort=${advanced.sort}`);
        }
        if (advanced && advanced.hasOwnProperty('start')) {
            queryParams = queryParams.concat(`&start=${advanced.start.toString()}`);
        }
        if (advanced && advanced.hasOwnProperty('format')) {
            queryParams = queryParams.concat(`&format=${advanced.format}`);
        }
        if (advanced && advanced.hasOwnProperty('cursor')) {
            queryParams = queryParams.concat(`&cursor=${advanced.cursor}`);
        }
        if (advanced && advanced.hasOwnProperty('fq')) {
            queryParams = queryParams.concat(`&fq=${advanced.fq}`);
        }
        if (advanced && advanced.hasOwnProperty('facet')) {
            queryParams = queryParams.concat(`&${advanced.facet}`);
        }
        const results = await this.client.post({
            service_name: this.serviceName,
            path: '/exposures/2013-01-01/search',
            version: null,
            data: `q=${query}${queryParams}`
        });
        return results as AetherSearchResponse;
    }
}
