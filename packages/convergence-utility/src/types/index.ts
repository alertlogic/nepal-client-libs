export type LookedUpUsers = { users: {[id: string]: UserData }  };

export type CollectionFilters = { filters: CollectionFilter[] };

export interface UserData {
    customer_name: string;
    email: string;
    first_name: string;
    full_name: string;
    last_name: string;
    user_id: string;
    username: string;
}

export interface CollectionFilter {
    field: string;
    name: string;
    product: string[];
    type: string;
    values: CollectionFilterValue[];
}

export interface CollectionFilterValue {
    name: string;
    product: string;
    value: string;
}





