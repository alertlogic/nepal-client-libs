import { AlChangeStamp } from '@al/core';

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

export interface AlResponderPlaybookParameter
{
    default?: string | boolean | string[];
    description?: string; enum?: string[];
    type?: string;
    immutable?: boolean;
    required?: boolean;
    secret?: string;
}

export interface AlResponderWorkflowContext
{
    vars ?: ({[key: string]: string} | string) []; // A list of input arguments for this workflow.
    input ?: ({[key: string]: unknown} | string) []; // A list of variables defined for the scope of this workflow.
    output ?: ({[key: string]: string} | string) []; // A list of variables defined as output for the workflow.
}

export interface AlResponderWorkflowActionWhen
{
    when ?: string;
    do ?: string; // | string[],
    publish ?: string; // | {[key: string]: string}[],
}

export interface AlResponderWorkflowTask {
    // https://docs.stackstorm.com/orquesta/languages/orquesta.html#task-model
    action ?: string; // The fully qualified name of the action to be executed.
    delay ?: number; // If specified, the number of seconds to delay the task execution.
    join ?: 'all' | number; // If specified, sets up a barrier for a group of parallel branches. //TBD
    with ?: string | {
        items: string,
        concurrency: number
    };// When given a list, execute the action for each item.
    retry ?: {
        when ?: string;
        count ?: number;
        delay ?: number;
    };// If specified, define requirements for task to be retried.
    // inputs
    input ?: {[key: string]: number | string | boolean | string[] | object}; // A dictionary of input arguments for the action execution.
    // output
    next ?: AlResponderWorkflowActionWhen[]; // Define what happens after this task is completed.
}

export interface AlResponderWorkflow extends AlResponderWorkflowContext{
    version ?: number; // The version of the spec being used in this workflow DSL.
    description ?: string; // The description of the workflow.
    tasks ?: AlResponderWorkflowTask;
}

export interface AlResponderPlaybook {
    id ?: string;
    name ?: string;
    description ?: string;
    type : 'incident' | 'observation' | 'exposure' | 'remediation';
    enabled ?: boolean;
    tags ?: {key:string, value:string}[]; // candidate to be a type
    parameters ?: {
        [key:string]: AlResponderPlaybookParameter
    };
    output_schema ?: object;
    workflow ?: AlResponderWorkflow;
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

export interface AlResponderInspectorError {
    message ?: string;
    schema_path ?: string;
    spec_path ?: string;
    type ?: string;
}
