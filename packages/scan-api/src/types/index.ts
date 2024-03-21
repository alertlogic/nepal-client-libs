
export interface ScanPolicy {
    policy_id: string;
    customer_id: string;
    policy_name: string;
    active: boolean;
}

export interface ScanPolicyListResponse {
    scan_policies: ScanPolicy[];
    total: number;
}
