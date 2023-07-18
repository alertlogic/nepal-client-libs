export interface TuningOptionScope {
    deployment_id?: string;
    region_key?: string;
    vpc_key?: string;
    vpc_id?: string;
    provider_type?: string;
    provider_id?: string;
}

export type TuningOptionValue = string | number | boolean | { [key: string]: unknown };

export interface TuningOption {
    id?: string;
    name?: string;
    scope?: TuningOptionScope;
    value?: TuningOptionValue;
}
