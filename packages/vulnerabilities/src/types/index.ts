export interface Remediation {
  name: string;
  id: string;
  description: string;
  vulnerability_ids: string[];
}

export interface Vulnerability {
    id: string;
    impact: string;
    description: string;
    remediation_id: string;
    cvss_vector: string;
    resolution: string;
    severity: string;
}
