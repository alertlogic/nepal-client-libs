export interface AlBlockingAction {
    userid: number;
    ingestid: string;
    eventid: number;
    duration: number;
    source_ip?: string;
    destination_ip?: string;
}

export interface AlBlockingActionsIds {
    actions_ids: number[];
}
