export interface AlWSMAppliance {
    appliance_id: number;
    appliance_name: string;
    customer_id: number;
    customer_name: string;
    zone_id: number;
    uuid: string;
    mte_appliance: number;
    create_date: number;
    features: string[];
}

export interface AlWSMConfigAppliance {
    proxy: unknown;
    system: unknown;
}
