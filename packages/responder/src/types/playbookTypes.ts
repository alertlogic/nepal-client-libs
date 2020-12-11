import { AlChangeStamp } from '@al/core';


export interface AlResponderActionShort {
    name ?: string;
    description ?: string;
    ref ?: string;
    pack ?: string;
}

export interface AlResponderActionLong extends AlResponderActionShort{
    id ?: string;
    parameters ?: {
        [key: string]: AlResponderPlaybookParameter;
    };
    output_schema ?: {
        [key: string]: AlResponderSchemaDetailProperty;
    };
    tags ? : {
        name:string;
        value:string;
    }[];
}

export interface AlResponderAction {
    category ?: object;
    action: AlResponderActionLong;
    allowed_values?: object;
}

export interface AlResponderPlaybookParameter
{
    default?: string | boolean | string[];
    description?: string; enum?: string[];
    type?: string;
    immutable?: boolean;
    required?: boolean;
    secret?: boolean;
    properties?: {
        [key: string]: object;
    };
}

export interface AlResponderWorkflowContext
{
    vars ?: ({[key: string]: string} | string) []; // A list of input arguments for this workflow.
    input ?: ({[key: string]: unknown} | string) []; // A list of variables defined for the scope of this workflow.
    output ?: ({[key: string]: string} | string) []; // A list of variables defined as output for the workflow.
}

export interface AlResponderWorkflowActionWhen
{
    x_alertlogic_condition_name ?: string; // this is not stack storm, just a way to identify conditions in ui side
    when ?: string;
    whenId?: string;
    do?: string[]; // many do add an array
    doOut?: string[];
    publish ?: {[key: string]: string}[];
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
    tasks ?: {
        [key:string]:AlResponderWorkflowTask;
    };
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

export interface AlResponderExecutionCommon{
    status ?: string;
    start_timestamp ?: string;
    elapsed_seconds ?: number;
    end_timestamp ?: string;
    result ?: object;
}

export interface AlResponderExecution extends AlResponderExecutionCommon{
    id ?: string;
    modified ?: AlChangeStamp;
    created ?: AlChangeStamp;
    playbook_id ?: string;
    type ?: string;
    account_id ?: string;
}

export interface AlResponderExecutionsHistory extends AlResponderExecutionCommon{
    id ?: string;
    task_id	?: string;
    task_name ?: string;
    parent_execution_id ?: string;
    playbook_type ?: string;
    type ?: string;
    playbook_id ?: string;
    playbook_name ?: string;
    native_id ?: string;
    parameters ?: unknown;
    action ?: unknown;
    modified ?: AlChangeStamp;
    created ?: AlChangeStamp;
}

export interface AlResponderExecutionSummary {
    deployments: {[key: string]: number}[];
    playbooks: {[key: string]: number}[];
    statuses: {[key: string]: number}[];
    types: {[key: string]: number}[];
}

export interface AlResponderExecutions {
    executions : AlResponderExecution[];
    count ?: number;
    marker ?: string;
    summary ?: AlResponderExecutionSummary;
}

export interface AlResponderInspectorError {
    message ?: string;
    schema_path ?: string;
    spec_path ?: string;
    type ?: string;
}

export interface AlResponderExecutionResultLog {
    status ?: string;
    timestamp ?: string;
}

export interface AlResponderExecutionResult extends AlResponderExecutionCommon {
    parameters ?: {[key: string]: number | string | boolean | string[] | object};
    action ?: AlResponderActionShort;
    children ?: AlResponderExecutionResult[];
    log ?: AlResponderExecutionResultLog[];
}

export interface AlResponderExecutionsHistoryResult {
    count: number;// minimum 0,
    marker: string;
    executions: AlResponderExecutionsHistory[];
    summary: {
        deployments ?: unknown[];
        statuses ?: unknown[];
        playbook_types ?: unknown[];
        playbook_ids ?: unknown[];
        playbook_names ?: unknown[];
        taksk ?: unknown[];
    };
}

export interface AlResponderExecutionQueryParams{
    limit ?: number;
    offset ?: number;
    marker ?: string;
    playbook_id ?: string;
    sort_by ?: 'start_timestamp' | 'end_timestamp';
    sort_order ?:  'asc' | 'desc';
    status ?: string;
    start_timestamp ?: string;
    end_timestamp ?: string;
    type ?: string;
}

export interface AlResponderExecutionsHistoryQueryParams{
    execution_type: string;
    limit ?: number;// default: 50 minimum: 10 maximum: 100
    marker ?: string;
    sort_by ?: 'start_timestamp' | 'end_timestamp';
    sort_order ?:  'asc' | 'desc';
    status ?: string;
    start_timestamp ?: string;
    end_timestamp ?: string;
    filter ?: {
        taks_id ?: string;
        task_name ?: string;
        playbook_id ?: string;
        parent_execution_id ?: string;
        native_id ?: string;
        status ?: status;
    };
}

export interface AlResponderSchema{
    name ?: string;
    version ?: string;
    schema ?: AlResponderSchemaDetail;
}

export interface AlResponderSchemaDetailProperty{
    type ?: string;
    description ?: string;
    enum ?: string[];
    items ?: {
        anyOf: []
        type: string;
    };
    additionalProperties ?: AlResponderSchemaDetailProperty;
    anyOf ?: AlResponderSchemaDetailProperty[];
    properties ?: {
        [key: string]: AlResponderSchemaDetailProperty;
    };
}

export interface AlResponderSchemaDetail{
    title ?: string;
    type ?: string;
    properties ?: {
        [key: string]: AlResponderSchemaDetailProperty;
    };
}

export type status = "new" | "requested" | "scheduled" | "delayed" | "running" | "succeeded" | "failed" | "timeout" | "canceled";
