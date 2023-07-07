export interface AlTuningRule {
    name: string;
    description?: string;
    tuning: AlTuningDetails;
}

export interface AlTuningDetails {
    type: string;
    selector: AlTuningOptionDetails;
    rules: AlTuningOptionDetails[];
    actions: AlTuningOptionDetails[];
}

export interface AlTuningOptionDetails {
    func: string;
    args: string[];
}

