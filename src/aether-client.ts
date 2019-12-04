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

export interface AetherSearchResponse {
    status?: {
        rid?: string;
        'time-ms'?: number;
    };
    hits?: {
        found?: number;
        start?: number;
        hit?:   AetherResult[];
    };
}

export class AetherClientInstance
{
    private serviceName = 'aether';

    public constructor( public client:AlApiClient = ALClient ) {
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
     * @param advanced Optional, currently unused
     */
    public async search( query:string,
                         advanced?: {
                            parser?: string,
                            options?: string,
                            size?: number,
                            sort?: string,
                            start?: number,
                            format?: string,
                            cursor?: string
                        } ) {
        const results = await this.client.post({
            service_name: this.serviceName,
            path: '/exposures/2013-01-01/search',
            version: null,
            data: `q=${encodeURIComponent(query)}`
        });
        return results as AetherSearchResponse;
    }
}
