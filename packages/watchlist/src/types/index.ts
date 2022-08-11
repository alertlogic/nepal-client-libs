export interface WatchlistItem {
    id?: string;
    key?: string;
    account_id?: string;
    added_on?: number;
    created_on?: number;
    deleted_on?: number;
    deployment_id?: string;
    environment_id?: string;
    name?: string;
    type?: string;
    user_id?: string;
}

export type WatchList = {[key: string]: WatchlistItem };
