export interface AlTuningRule {
    name: string;
    description?: string;
    tuning: AlTuningDetails;
}

export interface AlTuningDetails {
    type: string;
    selector: AlTuningSelectorDetails;
    rules: AlTuningRulesDetails[];
    actions: AlTuningActionsDetails[];
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
