import { AlChangeStamp, AlDynamicFormControlElement } from '@al/core';

export interface AlPlaybook {
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

export interface AlPlaybookAction {
    pack ?: object;
    action: {
        id ?: string;
        name ?: string;
        description ?: string;
        parameters ?: object;
        output_schema ?: object;

        // for ui visual part
        // for icons
        iconClass ?: string;
        icon: string,
        // to group or filter
        category ?: string;
    };
}
