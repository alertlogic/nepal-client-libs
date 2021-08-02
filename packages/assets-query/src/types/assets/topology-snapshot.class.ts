import { PhoenixTopologySnapshot } from './phoenix-topology-snapshot.class';
import { AssetDescriptor } from './asset-descriptor.class';

type AssetIteratorCallback = (asset: AssetDescriptor) => boolean;

export class TopologySnapshot {
    public static extraAssetTypes = ['load-balancer', 'image', 'sg', 'container', 'tag'];
    public regions: AssetDescriptor[] = [];
    public vpcs: AssetDescriptor[] = [];
    public extras: { [key: string]: AssetDescriptor[] } = {};

    public assetsByKey: { [key: string]: AssetDescriptor } = {};
    /* tslint:disable-next-line */
    public deployment_mode: string = null;

    constructor() {
    }

        /**
     *  @method TopologySnapshot.import
     *
     *  A static method to convert tabular assets data into a tree structure.
     *  This method expects to receive the raw object response from asset's topology endpoint
     *  https://console.cloudinsight.alertlogic.com/api/assets/#api-Assets_Queries-Topology_Query
     *  It returns a populated instance of type TopologySnapshot.
     */
    public static import(rawData: any): TopologySnapshot {
        let topology = new TopologySnapshot();
        if (!rawData.hasOwnProperty("topology")) {
            console.warn("Unexpected input: the input data to TopologySnapshot.import does not appear to be valid topology data");
            return topology;
        }
        for (let i = 0; i < rawData.topology.assets.length; i++) {
            let assetRow = rawData.topology.assets[i];
            let parent = null;
            for (let j = 0; j < assetRow.length; j++) {
                let asset = topology.getByKey(assetRow[j].key);
                if (!asset) {
                    asset = AssetDescriptor.import(assetRow[j]);
                    asset.parent = parent;
                    topology.add(asset, parent);
                }
                parent = asset;
            }
        }
        // extras
        for (let extraType of Object.keys(rawData.extras)) {
            if (rawData.extras.hasOwnProperty(extraType)) {
                for (let i = 0; i < rawData.extras[extraType]['assets'].length; i++) {
                    let assetRow = rawData.extras[extraType].assets[i];
                    let linkedAsset = topology.getByKey(assetRow[1].key);
                    let correlatedAsset = topology.getByKey(assetRow[0].key);
                    if (!correlatedAsset) {
                        correlatedAsset = AssetDescriptor.import(assetRow[0]);
                        correlatedAsset.parent = linkedAsset;
                        topology.add(correlatedAsset, linkedAsset);
                    }
                }
            }
        }
        return topology;
    }

    /**
     *  Gets any node in the tree, identified by key
     */
    public getByKey(key: string): AssetDescriptor {
        if (this.assetsByKey.hasOwnProperty(key)) {
            return this.assetsByKey[key];
        }
        return null;
    }

    /**
     *  Inserts an AssetDescriptor into the asset tree, appending it to the top level
     *  region & vpc lists if it is a region or vpc and adding it to a parent node if one is provided.
     */
    public add(asset: AssetDescriptor, parent: AssetDescriptor = null): AssetDescriptor {
        if (this.assetsByKey.hasOwnProperty(asset.key)) {
            console.warn("Internal error: cannot add an existing asset to a Topology Snapshot.  For shame!");
            return asset;
        }
        this.assetsByKey[asset.key] = asset;
        if (asset.type === "region") {
            this.regions.push(asset);
        }
        if (asset.type === "vpc") {
            this.vpcs.push(asset);
        }
        if (PhoenixTopologySnapshot.extraAssetTypes.indexOf(asset.type) >= 0) {
            if (this.extras[asset.type] && this.extras[asset.type].length > 0) {
                this.extras[asset.type].push(asset);
            } else {
                this.extras[asset.type] = [asset];
            }
        }
        if (parent && !parent.childByKey(asset.key)) {
            parent.children.push(asset);
        }
        return asset;
    }



    /**
     *  @method TopologySnapshot.iterate
     *
     *  @param {AssetIteratorCallback} iterator The callback method to be applied to each asset.
     *  @param {Array} typesFilter An option list of asset types that the iteration should be limited to.
     *
     *  Iterates through all of the assets in the topology snapshot, from the top level regions downward.
     *  Regions are assumed to be an allowed type, regardless of whether or not they are present in typesFilter.
     *
     */
    public iterate(iterator: AssetIteratorCallback, typesFilter: string[] = null): void {
        for (let i = 0; i < this.regions.length; i++) {
            this.regions[i].iterate(iterator, typesFilter);
        }
    }

    /**
     *  @method TopologySnapshot.getSummary
     *
     *  @param {AssetDescriptor} asset The object asset
     *
     *  This return array with the assets count summary
     *  It just support regions and vpcs
     *
     */
    public getSummary(asset: AssetDescriptor, scope: any): any {
        if (asset.type !== 'region' && asset.type !== 'vpc') {
            return {};
        }
        let subnets: AssetDescriptor[] = [];
        let summary: any = { vpcs: 0, subnets: 0, hosts: 0 };
        if (asset.type === 'vpc') {
            summary = { subnets: 0, hosts: 0, scoped_hosts: 0 };
            if (this.deployment_mode !== 'none') {
                summary['scanned'] = 0;
            }
        }
        asset.iterate(assetObj => {
            if (assetObj.type === 'subnet') {
                if (assetObj.properties.hasOwnProperty('alertlogic_security')) {
                    if (!assetObj.properties.alertlogic_security) {
                        summary.subnets++;
                        subnets.push(assetObj);
                    }
                } else {
                    summary.subnets++;
                    subnets.push(assetObj);
                }
            }
            if (assetObj.type === 'vpc' && asset.type === 'region') {
                if (scope.scopeIncludeByKey.hasOwnProperty(assetObj.key)) {
                    summary.vpcs++;
                } else if (!scope.scopeExcludeByKey.hasOwnProperty(assetObj.key)) {
                    let parent = assetObj.parent;
                    if (scope.scopeIncludeByKey.hasOwnProperty(parent.key)) {
                        summary.vpcs++;
                    }
                }
            }
            return true;
        });

        subnets.forEach(subnet => {
            subnet.iterate(subnetChild => {
                if (subnetChild.type === 'host') {
                    summary.hosts++;
                    if (asset.type === 'vpc') {
                        if (subnetChild.properties.hasOwnProperty('alertlogic_security')) {
                            if (!subnetChild.properties.alertlogic_security) {
                                summary.scoped_hosts++;
                            }
                        } else {
                            summary.scoped_hosts++;
                        }
                    }
                }
                return true;
            });
        });
        return summary;
    }
    /**
     * @method TopologySnapshot.getCoverage
     *
     * @param scope
     */
    public getCoverage(scope: any, deploymentMode: string = ''): any {
        this.deployment_mode = deploymentMode;
        let coverage: object;
        // TODO: USE nestedGet method
        if (!scope.hasOwnProperty("scopeIncludeByKey") || !scope.hasOwnProperty("scopeExcludeByKey")) {
            console.warn("Unexpected input: the input data to TopologySnapshot.getCoverage does not have a valid topology data");
            return coverage;
        }

        let vpcs: AssetDescriptor[] = [];
        let subnets: AssetDescriptor[] = [];
        let hosts: AssetDescriptor[] = [];
        let regions: AssetDescriptor[] = [];
        let regionsByKey: { [key: string]: AssetDescriptor } = {};
        let hostsByKey: { [key: string]: AssetDescriptor } = {};
        let subnetsByKey: { [key: string]: AssetDescriptor } = {};
        let vpcsByKey: { [key: string]: AssetDescriptor } = {};
        this.iterate(asset => {
            if (asset.type === 'vpc') {
                if (scope.scopeIncludeByKey.hasOwnProperty(asset.key)) {
                    asset.summary = this.getSummary(asset, scope);
                    vpcs.push(asset);
                    vpcsByKey[asset.key] = asset;
                } else if (!scope.scopeExcludeByKey.hasOwnProperty(asset.key)) {
                    let parent = asset.parent;
                    if (scope.scopeIncludeByKey.hasOwnProperty(parent.key)) {
                        asset.summary = this.getSummary(asset, scope);
                        vpcs.push(asset);
                        vpcsByKey[asset.key] = asset;
                    }
                }
            }
            return true;
        });
        vpcs.forEach(vpc => {
            if (vpc.parent && !regionsByKey.hasOwnProperty(vpc.parent.key)) {
                vpc.parent.summary = this.getSummary(vpc.parent, scope);
                regions.push(vpc.parent);
                regionsByKey[vpc.parent.key] = vpc.parent;
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
     * @method TopologySnapshot.getAllAssets
     *
     * @param scope
     */
    public getAllAssets(): any {

        let allAssets: object;
        let regions: AssetDescriptor[] = [];
        let vpcs: AssetDescriptor[] = [];
        let subnets: AssetDescriptor[] = [];
        let hosts: AssetDescriptor[] = [];
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

}
