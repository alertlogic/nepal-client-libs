import { SourceScope } from '@al/sources';
import { TopologyNode } from './topology-node.class';

type NodeIteratorCallback = (asset: TopologyNode) => boolean;


export interface Coverage {
    regions?: TopologyNode[];
    regionsCount?: number;
    regionsByKey?: {[i: string]: TopologyNode};
    vpcs?: TopologyNode[];
    vpcsCount?: number;
    vpcsByKey?: {[i: string]: TopologyNode};
    subnets?: TopologyNode[];
    subnetsCount?: number;
    subnetsByKey?: {[i: string]: TopologyNode};
    hosts?: TopologyNode[];
    hostsCount?: number;
    hostsByKey?: {[i: string]: TopologyNode};
}

export interface TopologyAssetsSummary {
    regions: TopologyNode[];
    vpcs: TopologyNode[];
    subnets: TopologyNode[];
    hosts: TopologyNode[];
    regionsCount: number;
    vpcsCount: number;
    subnetsCount: number;
    hostsCount: number;
}

export class PhoenixTopologySnapshot {

    static extraAssetTypes: string[] = ['load-balancer', 'image',
                                        'sg', 'container', 'tag',
                                        'appliance'];

    regions: TopologyNode[] = [];
    vpcs: TopologyNode[] = [];
    subnets: TopologyNode[] = [];
    extras: { [key: string]: TopologyNode[] } = {};
    assetsByKey: { [key: string]: TopologyNode } = {};
    deploymentMode: string = null;
    deploymentId: string = null;
    summary: { [i: string]: number } = {
        vpcs: 0,
        subnets: 0,
        regions: 0,
        running_hosts: 0, // aka billed hosts
        all_hosts: 0, // host.appliance + host.agent + host.running
        appliances: 0,
        tags: 0,
        containers: 0,
        security_groups: 0,
        images: 0,
        load_balancers: 0,
        all: 0
    };

    constructor() {
    }

    /**
     *  @method PhoenixTopologySnapshot.import
     *
     *  A static method to convert tabular assets data into a tree structure.
     *  This method expects to receive the raw object response from asset-query's topology endpoint
     *  https://console.product.dev.alertlogic.com/api/assets_query/index.html#api-Queries-Topology_Query
     *  It returns a populated instance of type TopologySnapshot.
     */
    static import(rawData) {
        let topology = new PhoenixTopologySnapshot();
        if (!rawData?.topology) {
            console.warn("Unexpected input: the input data to PhoenixTopologySnapshot.import does not appear to be valid topology data");
            return topology;
        }
        for (let i = 0; i < rawData.topology.assets.length; i++) {
            let assetRow = rawData.topology.assets[i];
            let parent = null;
            for (let j = 0; j < assetRow.length; j++) {
                let asset: TopologyNode = null;
                if (assetRow[j] && rawData.topology.data && rawData.topology.data[assetRow[j]]) {
                    asset = topology.getByKey(rawData.topology.data[assetRow[j]].key);
                }
                if (!asset && rawData.topology.data[assetRow[j]]) {
                    asset = TopologyNode.import(rawData.topology.data[assetRow[j]]);
                    asset.parent = parent;
                    topology.add(asset, parent);
                }
                parent = asset;
            }
        }

        if (rawData.topology?.extras) {
            rawData.topology.extras.forEach((pair: string[]) => {
                let correlatedAssetRow = rawData.topology.data[pair[1]];
                let linkedAssetRow = rawData.topology.data[pair[0]];
                let correlatedAsset = topology.getByKey(correlatedAssetRow.key) ? topology.getByKey(correlatedAssetRow.key) : TopologyNode.import(correlatedAssetRow);
                let linkedAsset = topology.getByKey(linkedAssetRow.key);
                correlatedAsset.parent = linkedAsset;
                topology.add(correlatedAsset, linkedAsset, true);
            });
        }

        if (topology.regions.length > 0) {
            topology.deploymentId = topology.regions[0].deploymentId;
        } else {
            console.error("Could not calculate deployment id of topology because of missing regions");
        }

        if (rawData['topology'].hasOwnProperty('asset_counts_by_type')) {
            topology.summary =
                PhoenixTopologySnapshot.calculateSummary(rawData['topology']['asset_counts_by_type']);
        }
        return topology;
    }

    static calculateSummary(assetCounts): { [i: string]: number } {
        let summary: { [i: string]: number } = {
            all: assetCounts['all']
        };
        ['region', 'vpc', 'subnet', 'host',
         'load-balancer', 'image', 'sg',
         'container', 'tag'].forEach(type => {
                if (assetCounts.hasOwnProperty(type) && type === 'subnet') {
                    summary['subnets'] = assetCounts['subnet']['standard'] || assetCounts['subnet']['all'];
                } else if (assetCounts.hasOwnProperty(type) && type !== 'host') {
                    summary[`${type}s`] = assetCounts[type];
                } else if (assetCounts.hasOwnProperty(type) && type === 'host') {
                    summary['running_hosts'] = assetCounts['host']['running'];
                    summary['all_hosts'] = assetCounts['host']['all'];
                    summary['appliances'] = assetCounts['host'].hasOwnProperty('appliance') ? assetCounts['host']['appliance'] : 0;
                } else if (!assetCounts.hasOwnProperty(type) && type === 'host') {
                    summary['running_hosts'] = 0;
                    summary['all_hosts'] = 0;
                    summary['appliances'] = 0;
                } else {
                    summary[`${type}s`] = 0;
                }
            });

        return summary;
    }

    /**
     *  Gets any node in the tree, identified by key
     */
    getByKey(key: string): TopologyNode {
        if (this.assetsByKey.hasOwnProperty(key)) {
            return this.assetsByKey[key];
        }
        return null;
    }

    /**
     *  Inserts an TopologyNode into the asset tree, appending it to the top level
     *  region & vpc lists if it is a region or vpc and adding it to a parent node if one is provided.
     */
    add(asset: TopologyNode, parent: TopologyNode = null, isExtra = false): TopologyNode {
        if (isExtra) {
            if (PhoenixTopologySnapshot.extraAssetTypes.indexOf(asset.type) >= 0) {
                if (!this.assetsByKey.hasOwnProperty(asset.key)) {
                    this.assetsByKey[asset.key] = asset;
                }
                if (PhoenixTopologySnapshot.extraAssetTypes.indexOf(parent.type) === -1) {
                    if (parent && !parent.childByKey(asset.key)) {
                        parent.children.push(asset);
                        parent.links.push({ source: parent, target: asset });
                    }
                    if (this.extras[asset.type] && this.extras[asset.type].length > 0) {
                        this.extras[asset.type].push(asset);
                    } else {
                        this.extras[asset.type] = [asset];
                    }
                }
            } else {
                console.warn(`Extra asset type ${asset.type} is not in the allowed extra asset types`);
                return asset;
            }

        } else {
            if (this.assetsByKey.hasOwnProperty(asset.key)) {
                console.warn("Internal error: cannot add an existing asset to a Topology Snapshot.  For shame!");
                return asset;
            }
            this.assetsByKey[asset.key] = asset;
            if (asset.type === "region") {
                this.regions.push(asset);
            } else if (asset.type === "vpc") {
                this.vpcs.push(asset);
            } else if (asset.type === "subnet") {
                this.subnets.push(asset);
            }
            if (parent && !parent.childByKey(asset.key)) {
                parent.children.push(asset);
                parent.links.push({ source: parent, target: asset });
            }
        }

        return asset;
    }

    /**
     *  @method PhoenixTopologySnapshot.iterate
     *
     *  @param {NodeIteratorCallback} iterator The callback method to be applied to each asset.
     *  @param {Array} typesFilter An option list of asset types that the iteration should be limited to.
     *
     *  Iterates through all of the assets in the topology snapshot, from the top level regions downward.
     *  Regions are assumed to be an allowed type, regardless of whether or not they are present in typesFilter.
     *
     */
    public iterate(iterator: NodeIteratorCallback, typesFilter: string[] = null): void {
        for (let i = 0; i < this.regions.length; i++) {
            this.regions[i].iterate(iterator, typesFilter);
        }
    }

    /**
     *  @method PhoenixTopologySnapshot.getSummary
     *
     *  @param {Array<string>} assetTypes
     *  @param {TopologyNode} startNode optional starting node
     *  @param {SourceScope} scope optional scope
     *
     *  This return dicionary with the assets count summary
     *
     */
    public getSummary(assetTypes: string[] = ['vpc', 'subnet', 'host', 'appliance'], startNodeKey?: string, scope?: SourceScope): {[i: string]: number} {
        const summary:  {[i: string]: number} = {};
        const subnets = [];
        assetTypes.forEach(type => { summary[type] = 0; });
        if (startNodeKey) {
            if (this.getByKey(startNodeKey).type !== 'region' && this.getByKey(startNodeKey).type !== 'vpc') {
                return {};
            }
            this.getByKey(startNodeKey).iterate((assetObj: TopologyNode) => {
                if (assetObj.type === 'subnet' && assetTypes.indexOf('subnet') >= 0) {
                    if (assetObj.properties.hasOwnProperty('alertlogic_security')) {
                        if (!assetObj.properties.alertlogic_security) {
                            summary['subnet']++;
                            subnets.push(assetObj);
                        }
                    } else {
                        summary['subnet']++;
                        subnets.push(assetObj);
                    }
                } else if (assetObj.type === 'vpc' && assetTypes.indexOf('vpc') >= 0) {
                    if (scope) {
                        if (this.getByKey(startNodeKey).type === 'region') {
                            if (scope.scopeIncludeByKey.hasOwnProperty(assetObj.key)) {
                                summary['vpc']++;
                            } else if (!scope.scopeExcludeByKey.hasOwnProperty(assetObj.key)) {
                                let parent = assetObj.parent;
                                if (!parent) {
                                    console.error(`Node without parent: ${assetObj}`);
                                    return false;
                                }
                                if (scope.scopeIncludeByKey.hasOwnProperty(parent.key)) {
                                    summary['vpc']++;
                                }
                            }
                        }
                    }
                }
                return true;
            }, assetTypes);
        } else {
            this.iterate(assetObj => {
                if (scope) {
                    if (assetTypes.indexOf(assetObj.type) >= 0) {
                        if (assetObj.properties.hasOwnProperty('alertlogic_security')) {
                            if (!assetObj.properties.alertlogic_security) {
                                if (scope.scopeIncludeByKey.hasOwnProperty(assetObj.key)) {
                                    summary[assetObj.type]++;
                                    if (assetObj.type === 'subnet') {
                                        subnets.push(assetObj);
                                    }
                                }
                            }
                        } else {
                            if (scope.scopeIncludeByKey.hasOwnProperty(assetObj.key)) {
                                summary[assetObj.type]++;
                                if (assetObj.type === 'subnet') {
                                    subnets.push(assetObj);
                                }
                            }
                        }
                    }
                } else {
                    if (assetTypes.indexOf(assetObj.type) >= 0) {
                        if (assetObj.properties.hasOwnProperty('alertlogic_security')) {
                            if (!assetObj.properties.alertlogic_security) {
                                summary[assetObj.type]++;
                            }
                        } else {
                            summary[assetObj.type]++;
                        }
                    }
                }
                return true;
            }, assetTypes);
        }
        if (assetTypes.find(type => type === 'appliance')) {
            summary['appliance'] = this.extras?.appliance ? this.extras.appliance.length : 0;
        }
        subnets.forEach(subnet => {
            subnet.iterate(subnetChild => {
                if (subnetChild.type === 'host') {
                    summary['host']++;
                }
                return true;
            });
        });

        summary['host'] -= summary['appliance'];
        return summary;
    }
    /**
     * @method PhoenixTopologySnapshot.getCoverage
     *
     * @param scope
     * @param deployment_mode
     * @param deploymentType
     */
    public getCoverage(scope: SourceScope, deploymentMode: string = '', deploymentType = 'aws'): Coverage {
        this.deploymentMode = deploymentMode;
        // TODO: USE nestedGet method
        if (!scope?.scopeIncludeByKey || !scope?.scopeExcludeByKey) {
            console.warn("Unexpected input: the input data to TopologySnapshot.getCoverage does not have a valid topology data");
            return {};
        }
        let assetTypes = ['region', 'vpc', 'subnet'];
        if (deploymentType === 'datacenter') {
            assetTypes = ['vpc', 'subnet'];
        }

        const vpcs: Array<TopologyNode> = [];
        const subnets: Array<TopologyNode> = [];
        const hosts: Array<TopologyNode> = [];
        const regions: Array<TopologyNode> = [];
        const regionsByKey: { [key: string]: TopologyNode } = {};
        const hostsByKey: { [key: string]: TopologyNode } = {};
        const subnetsByKey: { [key: string]: TopologyNode } = {};
        const vpcsByKey: { [key: string]: TopologyNode } = {};
        this.iterate(asset => {
            if (asset.type === 'vpc') {
                if (scope.scopeIncludeByKey.hasOwnProperty(asset.key)) {
                    asset.summary = this.getSummary(assetTypes, asset.key, scope);
                    vpcs.push(asset);
                    vpcsByKey[asset.key] = asset;
                } else if (!scope.scopeExcludeByKey.hasOwnProperty(asset.key)) {
                    let parent = asset.parent;
                    if (scope.scopeIncludeByKey.hasOwnProperty(parent.key)) {
                        asset.summary = this.getSummary(assetTypes, asset.key, scope);
                        vpcs.push(asset);
                        vpcsByKey[asset.key] = asset;
                    }
                }
            }
            return true;
        });
        vpcs.forEach(vpc => {
            if (deploymentType !== 'datacenter') {
                if (vpc.parent && !regionsByKey.hasOwnProperty(vpc.parent.key)) {
                    vpc.parent.summary = this.getSummary(assetTypes, vpc.parent.key, scope);
                    regions.push(vpc.parent);
                    regionsByKey[vpc.parent.key] = vpc.parent;
                }
            }
            vpc.iterate(vpcChild => {
                if (vpcChild.type === 'subnet') {
                    if (vpcChild.properties.hasOwnProperty('alertlogic_security')) {
                        if (!vpcChild.properties.alertlogic_security) {
                            subnets.push(vpcChild);
                            subnetsByKey[vpcChild.key] = vpcChild;
                        }
                    } else {
                        subnets.push(vpcChild);
                        subnetsByKey[vpcChild.key] = vpcChild;
                    }
                }
                return true;
            });
        });
        subnets.forEach(subnet => {
            subnet.iterate(subnetChild => {
                if (subnetChild.type === 'host') {
                    if (subnetChild.properties.hasOwnProperty('alertlogic_security')) {
                        if (!subnetChild.properties.alertlogic_security) {
                            hosts.push(subnetChild);
                            hostsByKey[subnetChild.key] = subnetChild;
                        }
                    } else {
                        hosts.push(subnetChild);
                        hostsByKey[subnetChild.key] = subnetChild;
                    }
                }
                return true;
            });
        });
        return {
            hosts,
            subnets,
            vpcs,
            regions,
            regionsCount: regions.length,
            regionsByKey: regionsByKey,
            vpcsCount: vpcs.length,
            vpcsByKey: vpcsByKey,
            subnetsCount: subnets.length,
            subnetsByKey: subnetsByKey,
            hostsCount: hosts.length,
            hostsByKey: hostsByKey
        } as Coverage;
    }


    /**
     * @method PhoenixTopologySnapshot.getAllAssets
     *
     */
    getAllAssets(): TopologyAssetsSummary {
        const regions: Array<TopologyNode> = [];
        const vpcs: Array<TopologyNode> = [];
        const subnets: Array<TopologyNode> = [];
        const hosts: Array<TopologyNode> = [];
        this.iterate(asset => {
            switch (asset.type) {
                case 'region':
                    regions.push(asset);
                    break;
                case 'vpc':
                    vpcs.push(asset);
                    break;
                case 'subnet':
                    if (!this.isAlSecurity(asset)) {
                        subnets.push(asset);
                    }
                    break;
                case 'host':
                    if (!this.isAlSecurity(asset)) {
                        hosts.push(asset);
                    }
                    break;
                default:
                    break;
            }
            return true;
        });
        return {
            regions,
            vpcs,
            subnets,
            hosts,
            regionsCount: regions.length,
            vpcsCount: vpcs.length,
            subnetsCount: subnets.length,
            hostsCount: hosts.length
        } as TopologyAssetsSummary;
    }

    private isAlSecurity(asset: TopologyNode): boolean {
        return !!asset.properties?.alertlogic_security;
    }

}
