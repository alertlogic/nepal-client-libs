export interface AlAssetsManagerReportSummary {
    vpc_count?: number;
    subnet_count?: number;
    region_count?: number;
    host_count?: number;
    deployment_count?: number;
    appliance_count?: number;
    agent_count?: number;
}

export interface AlAssetsManagerReportSummaryQueryParams {
    asset_type?: string;
    asset_key?: string;
}
