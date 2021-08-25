type AssetIteratorCallback = (asset: AssetDescriptor) => boolean;

export class AssetDescriptor {
    type: string = null;
    key: string = null;
    name: string = null;
    parent: AssetDescriptor = null;
    children: AssetDescriptor[] = [];
    summary: {[i: string] : number} = {};
    properties: { [property: string]: any } = {};
    dnsName: string;
    state: string;
    operation: string;
    scope: string;
    ipAddress: string;

    constructor() {
    }

    public static import(rawData: any): AssetDescriptor {

        const asset = new AssetDescriptor();

        if (!rawData?.type || !rawData?.key) {
            console.warn("Unexpected input: asset representations must have at least 'type' and 'key' properties");
            return asset;
        }

        asset.type = rawData.type;
        asset.key = rawData.key;
        asset.name = rawData?.name ?? rawData.key;
        asset.properties = rawData;
        asset.summary = {};
        asset.dnsName = rawData?.dns_name ?? null;
        asset.ipAddress = rawData?.ip_address ?? null;
        asset.state = rawData?.state ?? null;
        asset.operation = rawData?.operation ?? null;
        asset.scope = rawData?.scope ?? null;

        return asset;
    }

    /**
     *  Retrieves a child AssetDescriptor, identified by key, if this AssetDescriptor has such a child.
     */
    childByKey(key: string): AssetDescriptor {
        return this.children.find(child => child.key === key) ?? null;
    }

    /**
     *  The `lineage` iteration method allows the caller to ascend upwards through the topology view, from lowest to highest.
     */
    lineage(iterator: AssetIteratorCallback): void {
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
    iterate(iterator: AssetIteratorCallback, typesFilter: string[] = null): void {
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

