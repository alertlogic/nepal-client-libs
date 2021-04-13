import { AssetDescriptor } from './asset-descriptor.class';

type NodeIteratorCallback = ( asset: TopologyNode) => boolean;

export class TopologyNode extends AssetDescriptor {
    children: TopologyNode[] = [];
    parent: TopologyNode | null = null;
     /** UI properties */
    excluded = false; // To be use for exclusions in Configuration
    matched = true; // To be use when searching an asset.
    nchildren: {source: TopologyNode, target: TopologyNode}[] = []; // To be use for the Solar System algorithm
    flavor = ''; // To be use with Protection Level visualization.
    remediationsThreatLevel = null; // To be use in Overview Topology for node coloring
    securityRemediations = false;
    configurationRemediations = false;
    incidentsThreatLevel; // To be use in Overview Topology for node coloring
    expediteScanPending = false; // To paint nodes with expedite scan pending in Overview Topology
    lastScan = null; // To be use in the tooltip in Overview Topology
    scanInProgress = false; // To paint nodes with active scans in Overview Topology
    hasCredentials = false; // To paint nodes with credentials in Overview Topology
    peeredFrom: TopologyNode[] = []; // For vpc peering
    peeredTo: TopologyNode | null = null; // For vpc peering
    selected = false;
    deploymentId: string = null;
    stoppedInstance: boolean;
    nodeId: string;
    focused: boolean;

    static import(rawData) {
        let asset = new TopologyNode();
        asset.type = rawData.type;
        asset.key = rawData.key;
        asset.deploymentId =  rawData?.deployment_id ?? null;
        asset.name = rawData?.name ? rawData.name : rawData.key;
        asset.flavor =  rawData?.flavor ?? '';
        asset.properties = rawData;
        asset.summary = {};
        return asset;
    }

     /**
     *  Retrieves a child AssetDescriptor, identified by key, if this AssetDescriptor has such a child.
     */
    childByKey(key: string): TopologyNode {
        return this.children.find(child => child.key === key) ?? null;
    }

    /**
     *  The `lineage` iteration method allows the caller to ascend upwards through the topology view, from lowest to highest.
     */
    lineage(iterator: NodeIteratorCallback): void {
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
    iterate(iterator: NodeIteratorCallback, typesFilter: string[] = null): void {
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
