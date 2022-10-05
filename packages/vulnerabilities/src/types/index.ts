export interface Remediation {
  name: string;
  id: string;
  description: string;
  vulnerability_ids: string[];
}

export interface Vulnerability {
    class?: string;
    cve?: string[];
    cvss_vector?: string;
    description?: string;
    exposure_id?: string;
    full_description?: string;
    id: string;
    impact?: string;
    pci_severity?: string;
    reference?: string;
    remediation_id?: string;
    resolution?: string;
    severity?: string;
}
