import { AssetIteratorCallback } from '.';

export class AssetDescriptor {
    public type: string = null;
    public key: string = null;
    public name: string = null;
    public parent: AssetDescriptor = null;
    public children: AssetDescriptor[] = [];
    public properties: { [property: string]: any } = {};
    public summary: any = {};

    constructor() {
    }

    public static import(rawData: any) {

        let asset = new AssetDescriptor();

        if (!rawData.hasOwnProperty("type") || !rawData.hasOwnProperty("key")) {
            console.warn("Unexpected input: asset representations must have at least 'type' and 'key' properties");
            return asset;
        }

        asset.type = rawData.type;
        asset.key = rawData.key;
        asset.name = rawData.hasOwnProperty('name') ? rawData.name : rawData.key;
        asset.properties = rawData;
        asset.summary = {};
        return asset;
    }

    /**
     *  Retrieves a child AssetDescriptor, identified by key, if this AssetDescriptor has such a child.
     */
    public childByKey(key: string): AssetDescriptor {
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i].key === key) {
                return this.children[i];
            }
        }
        return null;
    }

    /**
     *  The `lineage` iteration method allows the caller to ascend upwards through the topology view, from lowest to highest.
     */
    public lineage(iterator: AssetIteratorCallback): void {
        let shouldContinue = iterator(this);
        if (shouldContinue) {
            if (this.parent) {
                this.parent.lineage(iterator);
            }
        }
    }

    /**
     *  The `iterate` method allows the caller to descend into the topology view from a given asset.
     */
    public iterate(iterator: AssetIteratorCallback, typesFilter: string[] = null): void {
        let shouldContinue = iterator(this);
        if (!shouldContinue) {
            return;
        }
        for (let i = 0; i < this.children.length; i++) {
            if (typesFilter === null || typesFilter.indexOf(this.children[i].type) >= 0) {
                this.children[i].iterate(iterator);
            }
        }
    }
}
