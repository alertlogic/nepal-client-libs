/**
 * An almost exact copy of the AssetDescriptor class but with added properties only used
 * in the frontend for rendering the topology tree. In theory, this class should be
 * over the visualizations module, but I couldn't think of a way to decouple the rendering-specific
 * properties from from core client ones given that the topology is query for other purposes
 * besides graph rendering... so (shrug)
 */

import { AssetDescriptor } from './asset-descriptor.class';

type NodeIteratorCallback = ( asset: TopologyNode) => boolean;

export interface TopologyNodeLink {
     source: TopologyNode;
     target: TopologyNode;
}

export class TopologyNode extends AssetDescriptor {
    children: TopologyNode[] = [];
    parent: TopologyNode | null = null;
     /** UI properties */
    excluded: boolean = false; // To be use for exclusions in Configuration
    matched: boolean = true; // To be use when searching an asset.
    links: TopologyNodeLink[] = []; // To be use for the Solar System algorithm
    flavor = ''; // To be use with Protection Level visualization.
    remediationsThreatLevel = null; // To be use in Overview Topology for node coloring
    securityRemediations: boolean = false;
    configurationRemediations = false;
    incidentsThreatLevel; // To be use in Overview Topology for node coloring
    expediteScanPending = false; // To paint nodes with expedite scan pending in Overview Topology
    lastScan = null; // To be use in the tooltip in Overview Topology
    scanInProgress: boolean = false; // To paint nodes with active scans in Overview Topology
    hasCredentials: boolean = false; // To paint nodes with credentials in Overview Topology
    peeredFrom: TopologyNode[] = []; // For cross-network protection
    peeredTo: TopologyNode | null = null; // For cross-network protection
    deploymentName?: string; // For cross-network protection
    hasVpcId: boolean; // For cross-network protection
    selected: boolean = false;
    deploymentId: string = null;
    stoppedInstance: boolean;
    nodeId: string;
    focused: boolean;

    static import(rawData: any): TopologyNode {
        let asset = new TopologyNode();
        asset.type = rawData.type;
        asset.key = rawData.key;
        asset.deploymentId =  rawData?.deployment_id ?? null;
        asset.name = rawData?.name ? rawData.name : rawData.key;
        asset.flavor =  rawData?.flavor ?? '';
        asset.properties = rawData;
        asset.summary = {};
        asset.hasVpcId = !!asset.properties?.vpc_id;
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


