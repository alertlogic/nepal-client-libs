import { AlChangeStamp } from '@al/core';

export interface AlResponderPlaybook {
    id ?: string;
    name ?: string;
    description ?: string;
    type : 'incident' | 'observation' | 'exposure' | 'remediation';
    enabled ?: boolean;
    tags ?: {key:string, value:string}[]; // candidate to be a type
    parameters ?: {
        [key:string]:{
            required ?: boolean,
            type ?: string, // need to review options availables
            description ?: string
        }
    };
    output_schema ?: object;
    workflow ?: object;
}

export interface AlResponderAction {
    category ?: object;
    action: {
        id ?: string;
        name ?: string;
        description ?: string;
        parameters ?: object;
        output_schema ?: object;

        ref ?: string;
        // for ui visual part
        // for icons
        iconClass ?: string;
        icon: string,
        // to group or filter
        category ?: string;
    };
}

export interface AlResponderExecution {
    id ?: string;
    modified ?: AlChangeStamp;
    created ?: AlChangeStamp;
    playbook_id ?: string;
    status ?: string;
    type ?: string;
    account_id ?: string;
}

export interface AlResponderExecutions {
    executions : AlResponderExecution[];
    total_count ?: string;
}
