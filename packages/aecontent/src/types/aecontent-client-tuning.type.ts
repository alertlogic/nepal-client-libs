export interface AlTuningRule {
    name: string;
    tuning: AlTuningDetails;
    uuid?: string;
    version?: string;
    schema_version?: string;
}

export interface AlTuningDetails {
    type: string;
    selector: AlTuningSelectorDetails;
    rules: AlTuningRulesDetails[];
    actions: AlTuningActionsDetails[];
    description?: string;
}

export interface AlTuningOptionDetails {
    func: string;
    args: string[];
}

export interface AlTuningSelectorDetails {
    func: string;
    args: string[];
}

export interface AlTuningRulesDetails {
    func: string;
    args: string[];
}

export interface AlTuningActionsDetails {
    func: string;
    args: (string|string[])[];
}
