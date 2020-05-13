import { NodeIteratorCallback } from '.';
import { AssetDescriptor } from './asset-descriptor.class';

export class TopologyNode extends AssetDescriptor {
    public children: TopologyNode[] = [];
    public parent: TopologyNode = null;
    /** UI properties */
    public excluded = false; // To be use for exclusions in Configuration
    public matched = true; // To be use when searching an asset.
    /* tslint:disable-next-line */
    public _children: any[] = []; // To be use for the Solar System algorithm
    public flavor = ''; // To be use with Protection Level visualization.
    public remediationsThreatLevel; // To be use in Overview Topology for node coloring
    public securityRemediations = false;
    public configurationRemediations = false;
    public incidentsThreatLevel; // To be use in Overview Topology for node coloring
    public expediteScanPending = false; // To paint nodes with expedite scan pending in Overview Topology
    public lastScan; // To be use in the tooltip in Overview Topology
    public scanInProgress = false; // To paint nodes with active scans in Overview Topology
    public hasCredentials = false; // To paint nodes with credentials in Overview Topology
    public peeredFrom: TopologyNode[] = []; // For vpc peering
    public peeredTo: TopologyNode; // For vpc peering
    public selected = false;
    public deploymentId: string = null;

    public static import(rawData: any) {

        let asset = new TopologyNode();

        if (!rawData.hasOwnProperty("type") || !rawData.hasOwnProperty("key")) {
            console.warn("Unexpected input: asset representations must have at least 'type' and 'key' properties");
            return asset;
        }

        asset.type = rawData.type;
        asset.key = rawData.key;
        asset.deploymentId = rawData.hasOwnProperty('deployment_id') ? rawData.deployment_id : null;
        asset.name = rawData.hasOwnProperty('name') ? rawData.name : rawData.key;
        asset.flavor = rawData.hasOwnProperty('flavor') ? rawData.flavor : '';
        asset.properties = rawData;
        asset.summary = {};
        return asset;
    }

    /**
    *  Retrieves a child AssetDescriptor, identified by key, if this AssetDescriptor has such a child.
    */
    public childByKey(key: string): TopologyNode {
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
    public lineage(iterator: NodeIteratorCallback): void {
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
    public iterate(iterator: NodeIteratorCallback, typesFilter: string[] = null): void {
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
