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
