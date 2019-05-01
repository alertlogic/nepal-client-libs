/**
 * Module to deal with available Ticket Master Public API endpoints
 */
import { ALClient } from '@al/client';

export interface HitResponse {
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

export interface SearchResponse {
  status?: {
    rid?: string;
    'time-ms'?: number;
  };
  hits?: {
    found?: number;
    start?: number;
    hit?: HitResponse[];
  };
}

class AetherClient {

  private alClient = ALClient;
  private serviceName = 'aether';

  /**
   * Exposures Search
   * POST
   * /aether/exposures/2013-01-01/search
   * "https://api.cloudinsight.alertlogic.com/aether/exposures/2013-01-01/search"
   */
  async search(queryParams: {q: string, parser?: string, options?: string, size?: number, sort?: string, start?: number, format?: string, cursor?: string}) {
    const results = await this.alClient.fetch({
      service_name: this.serviceName,
      path: '/exposures/2013-01-01/search',
      params: queryParams,
    });
    return results as SearchResponse;
  }

}

export const aetherClient = new AetherClient();
