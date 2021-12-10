
export interface AEtagset<T> {
    tagset: T;
    metadata: {
        name: string,
        merge: string,
        composition: Array<string>
    };
}

export interface AEtagsetList<T> {
    [path: string]: AEtagset<T>;
}

