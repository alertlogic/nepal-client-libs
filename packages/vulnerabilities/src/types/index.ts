export interface Remediation {
  name: string;
  id: string;
  description: string;
  vulnerability_ids: string[];
}

export interface Vulnerability {
    class?: string;
    cve?: string[];
    cvss_score?: number;
    cvss_vector?: string;
    cvss_version?: string;
    cwe?: string;
    cwe_name?: string;
    cwe_type?: string;
    cwe_url?: string;
    description?: string;
    exposure_id?: string;
    full_description?: string;
    id: string;
    impact?: string;
    pci_severity?: string;
    reference?: string;
    remediation_id?: string;
    resolution?: string;
    scores?: VulnerabilityScore[];
    severity?: string;
}

export interface VulnerabilityScore {
  score?: number;
  severity?: string;
  vector?: string;
  version?: string;
}
