import { SourceScope } from '@al/sources';
import { TopologyNode } from './topology-node.class';

type NodeIteratorCallback = (asset: TopologyNode) => boolean;

export class PhoenixTopologySnapshot {
    public static extraAssetTypes = ['load-balancer', 'image', 'sg', 'container', 'tag'];
    public regions: TopologyNode[] = [];
    public vpcs: TopologyNode[] = [];
    public subnets: TopologyNode[] = [];
    public extras: { [key: string]: TopologyNode[] } = {};
    public assetsByKey: { [key: string]: TopologyNode } = {};
    /* tslint:disable-next-line */
    public deployment_mode: string = null;
    public deploymentId: string = null;

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
    public static import(rawData: any) {
        let topology = new PhoenixTopologySnapshot();
        if (!rawData.hasOwnProperty("topology")) {
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

        if (rawData.topology.hasOwnProperty('extras')) {
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

        return topology;
    }

    /**
     *  Gets any node in the tree, identified by key
     */
    public getByKey(key: string): TopologyNode {
        if (this.assetsByKey.hasOwnProperty(key)) {
            return this.assetsByKey[key];
        }
        return null;
    }

    /**
     *  Inserts an TopologyNode into the asset tree, appending it to the top level
     *  region & vpc lists if it is a region or vpc and adding it to a parent node if one is provided.
     */
    public add(asset: TopologyNode, parent: TopologyNode = null, isExtra = false) {
        if (isExtra) {
            if (PhoenixTopologySnapshot.extraAssetTypes.indexOf(asset.type) >= 0) {
                if (!this.assetsByKey.hasOwnProperty(asset.key)) {
                    this.assetsByKey[asset.key] = asset;
                }
                if (PhoenixTopologySnapshot.extraAssetTypes.indexOf(parent.type) === -1) {
                    if (parent && !parent.childByKey(asset.key)) {
                        parent.children.push(asset);
                        parent._children.push({ source: parent, target: asset });
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
                parent._children.push({ source: parent, target: asset });
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
    public getSummary(assetTypes: string[] = ['vpc', 'subnet', 'host'], startNodeKey?: string, scope?: SourceScope): any {
        const summary = {};
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
        subnets.forEach(subnet => {
            subnet.iterate(subnetChild => {
                if (subnetChild.type === 'host') {
                    summary['host']++;
                }
                return true;
            });
        });
        return summary;
    }
    /**
     * @method PhoenixTopologySnapshot.getCoverage
     *
     * @param scope
     * @param deployment_mode
     * @param deploymentType
     */
    public getCoverage(scope: SourceScope, deploymentMode: string = '', deploymentType = 'aws') {
        this.deployment_mode = deploymentMode;
        let coverage: object;
        // TODO: USE nestedGet method
        if (!scope.hasOwnProperty("scopeIncludeByKey") || !scope.hasOwnProperty("scopeExcludeByKey")) {
            console.warn("Unexpected input: the input data to TopologySnapshot.getCoverage does not have a valid topology data");
            return coverage;
        }
        let assetTypes = ['region', 'vpc', 'subnet'];
        if (deploymentType === 'datacenter') {
            assetTypes = ['vpc', 'subnet'];
        }

        let vpcs: TopologyNode[] = [];
        let subnets: TopologyNode[] = [];
        let hosts: TopologyNode[] = [];
        let regions: TopologyNode[] = [];
        let regionsByKey: { [key: string]: TopologyNode } = {};
        let hostsByKey: { [key: string]: TopologyNode } = {};
        let subnetsByKey: { [key: string]: TopologyNode } = {};
        let vpcsByKey: { [key: string]: TopologyNode } = {};
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
        coverage = {
            regions: regions,
            regionsCount: regions.length,
            regionsByKey: regionsByKey,
            vpcs: vpcs,
            vpcsCount: vpcs.length,
            vpcsByKey: vpcsByKey,
            subnets: subnets,
            subnetsCount: subnets.length,
            subnetsByKey: subnetsByKey,
            hosts: hosts,
            hostsCount: hosts.length,
            hostsByKey: hostsByKey
        };
        return coverage;
    }


    /**
     * @method PhoenixTopologySnapshot.getAllAssets
     *
     */
    public getAllAssets() {

        let allAssets: object;
        let regions: TopologyNode[] = [];
        let vpcs: TopologyNode[] = [];
        let subnets: TopologyNode[] = [];
        let hosts: TopologyNode[] = [];
        this.iterate(asset => {
            if (asset.type === 'region') {
                regions.push(asset);
            }
            if (asset.type === 'vpc') {
                vpcs.push(asset);
            }
            if (asset.type === 'subnet') {
                if (asset.properties.hasOwnProperty('alertlogic_security')) {
                    if (!asset.properties.alertlogic_security) {
                        subnets.push(asset);
                    }
                } else {
                    subnets.push(asset);
                }
            }
            if (asset.type === 'host') {
                if (asset.properties.hasOwnProperty('alertlogic_security')) {
                    if (!asset.properties.alertlogic_security) {
                        hosts.push(asset);
                    }
                } else {
                    hosts.push(asset);
                }
            }
            return true;
        });

        allAssets = {
            regions: regions,
            vpcs: vpcs,
            subnets: subnets,
            hosts: hosts,
            regionsCount: regions.length,
            vpcsCount: vpcs.length,
            subnetsCount: subnets.length,
            hostsCount: hosts.length
        };
        return allAssets;
    }

    /**
    * Performs the search of assets matching a string against fields: key, name and description.
    *
    * This function traverses the topology set to find assets matching a search phrase,
    * optionally limiting to visible elements, and applies a callback to *each* corresponding graph node.
    * @param {PhoenixTopologySnapshot} topology The topology data
    * @param {string} selectedRegionKey the asset key of a region item in topology (set as undefined it there is not one)
    * @param {string} searchPhrase text to do to pattern matching with.
    * @param {boolean} includeInvisibleItems is a flag to tell whether include un-scoped and filtered assets or not
    * @returns the  assets found.
    */
    search = (topology: PhoenixTopologySnapshot, selectedRegionKey: string, searchPhrase: string, includeInvisibleItems: boolean): any => {
        let hits = {};

        /**
        * Performs the search on asset fields
        * @returns {boolean} true for matched, false otherwise.
        */
        const match = (asset: TopologyNode): boolean => {
            const searchMatch = new RegExp(searchPhrase
                .replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
                    '\\$&'), 'i');
            let matched = false;

            if (!includeInvisibleItems) {
                if (asset['exclude']) {
                    return false;
                }
            }

            /* More fields could be included in search here */
            matched = searchMatch.test(asset.key);
            matched = matched || (asset.name && searchMatch.test(asset.name));
            matched = matched || (asset.properties['description'] && searchMatch.test(asset.properties['description']));
            matched = matched || (asset.properties['private_ip_address'] && searchMatch.test(asset.properties['private_ip_address']));
            matched = matched || (asset.properties['ip_address'] && searchMatch.test(asset.properties['ip_address']));

            if (matched) {
                asset.matched = true;
                hits[asset.key] = asset;
            } else {
                asset.matched = false;
            }
            return matched;
        };

        if (selectedRegionKey) {
            topology.getByKey(selectedRegionKey).iterate((node: TopologyNode) => {
                match(node);
                return true;
            });
        } else {
            topology.iterate((node: TopologyNode) => {
                match(node);
                return true;
            });
        }
        return hits;
    }


}
