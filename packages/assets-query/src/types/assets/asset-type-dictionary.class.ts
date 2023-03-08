import { REGION_DICTIONARY } from './region-dictionary';
export interface IAssetType {
    type: string;
    caption: string;
    topological: boolean;
    pluralCaption?: string;
    icon?: string;
    iconMt?: string;
    debbug?: boolean;
    format?: string;
    types?: Array<string>;
    renderName?(asset: any): string;
    getAssetDetails?(asset: any): any;
    renderDescription?(asset: any): string;
    getSetName?(asset: any): string;
    renderID?(asset: any): string;
    transform?(value: any, assetParam?: any, key?: any): any;
}

export class AssetTypeDictionary {
    /* tslint:disable */
    public static types: { [type: string]: IAssetType } = {

        /*  Default entry.  This type doesn't occur in nature, but is provided so that arbitrary asset types (such as scope, acl, acl-entry, network-interface, etc)
         *  can be digested without causing crashes or relying on error checking. */
        "_default": {
            type: "any",
            topological: false,
            renderName: function (asset): string {
                if (asset.type) {
                    return asset.type + " '" + (asset.name ? asset.name : asset.key) + "'";
                }
                return "Unknown object '" + (asset.name ? asset.name : asset.key) + "'";
            },
            getAssetDetails: function (asset: any): any[] {
                const assetDetails = [];
                const assetDetailsInfo = {
                    "key": {
                        caption: "Key",
                        icon: "al al-key",
                        format: null,
                        show: true
                    },
                    "type": {
                        caption: "Type",
                        icon: "al al-type",
                        format: null,
                        transform: function (value, assetParam, key) {
                            if (value === "vpc") {
                                return "VPC";
                            } else if (value === "sg") {
                                return "Security Group";
                            } else {
                                if (value.indexOf("-") !== -1) {
                                    value = value.replace("-", " ");
                                }
                                return value;
                            }
                        },
                        show: true
                    },
                    "name": {
                        caption: "Name",
                        icon: "al al-name",
                        format: null,
                        show: true
                    },
                    "scope_aws_region_endpoint": {
                        caption: "Region Endpoint",
                        icon: "al al-region",
                        format: null,
                        show: true
                    },
                    "scope_aws_asset": {
                        caption: "Asset",
                        icon: "al al-instance",
                        format: null,
                        show: true
                    },
                    "scope_aws_tag_key": {
                        caption: "Tag Key",
                        icon: "al al-tag",
                        format: null,
                        show: true
                    },
                    "scope_aws_tag_value": {
                        caption: "Tag",
                        icon: "al al-tag",
                        format: null,
                        show: true
                    },
                    "scope_aws_availability_zone": {
                        caption: "Availability Zone",
                        icon: "al al-zone",
                        format: null,
                        show: true
                    },
                    "scope_aws_vpc_id": {
                        caption: "VPC ID",
                        icon: "al al-vpc",
                        format: null,
                        show: true
                    },
                    "scope_aws_subnet_id": {
                        caption: "Subnet ID",
                        icon: "al al-subnet",
                        format: null,
                        show: true
                    },
                    "cidr_block": {
                        caption: "CIDR Block",
                        icon: "al al-route",
                        format: null,
                        show: true
                    },
                    "instance_id": {
                        caption: "Instance ID",
                        icon: "al al-instance",
                        format: null,
                        show: true
                    },
                    "instance_type": {
                        caption: "Instance Type",
                        icon: "al al-instance",
                        format: null,
                        show: true
                    },
                    "private_ip_address": {
                        caption: "Private IP Address",
                        icon: "al al-ip-private",
                        format: null,
                        show: true
                    },
                    "ip_address": {
                        caption: "IP Address",
                        icon: "al al-ip",
                        format: null,
                        show: true
                    },
                    "architecture": {
                        caption: "Architecture",
                        icon: "al al-architecture",
                        format: null,
                        show: true
                    },
                    "dns_name": {
                        caption: "DNS Name",
                        icon: "al al-dns",
                        format: null,
                        show: true
                    },
                    "scope_aws_iam_instance_profile": {
                        caption: "IAM Instance Profile",
                        icon: "al al-iam",
                        format: null,
                        show: true
                    },
                    "scope_aws_image_id": {
                        caption: "Image ID",
                        icon: "al al-image",
                        format: null,
                        show: true
                    },
                    "scope_aws_kernel_id": {
                        caption: "Kernel ID",
                        icon: "al al-kernel",
                        format: null,
                        show: true
                    },
                    "scope_aws_key_name": {
                        caption: "Key Name",
                        icon: "al al-key",
                        format: null,
                        show: true
                    },
                    "scope_aws_state": {
                        caption: "Current State",
                        icon: "fa fa-clock-o",
                        format: null,
                        show: true
                    },
                    "scope_aws_private_dns_name": {
                        caption: "Private DNS Name",
                        icon: "al al-dns-private",
                        format: null,
                        show: true
                    },
                    "scheme": {
                        caption: "Scheme",
                        icon: "fa fa-line-chart",
                        format: null,
                        show: true
                    },
                    "source_security_group": {
                        caption: "Security Group",
                        icon: "al al-sg",
                        format: null,
                        show: true
                    },
                    "scope_aws_canonical_hosted_zone_id": {
                        caption: "Canonical Hosted Zone ID",
                        icon: "al al-zone",
                        format: null,
                        show: true
                    },
                    "scope_aws_canonical_hosted_zone_name": {
                        caption: "Canonical Hosted Zone Name",
                        icon: "al al-zone",
                        format: null,
                        show: true
                    },
                    "scope_aws_dns_name": {
                        caption: "DNS Name",
                        icon: "al al-dns",
                        format: null,
                        show: true
                    },
                    "scope_aws_group_description": {
                        caption: "Group Description",
                        icon: "al al-application-set",
                        format: null,
                        show: true
                    },
                    "scope_aws_launch_time": {
                        caption: "Launch Time",
                        icon: "al al-launch-time",
                        format: "date",
                        show: true,
                        transform: function (value, assetParam, key) {
                            return value * 1000;
                        }
                    },
                    // To do: Make the threatiness value meaningful to the user.
                    /*"threatiness" : {
                           caption: gettext("Threatiness"),
                           icon: "fa fa-exclamation-triangle",
                           format: null,
                           transform: function( value, asset, key ) {
                           return ALUtilityService.getThreatLevelFromCVSS(value).label;
                           },
                           show: true
                        },*/
                    "scope_scan_last_scan_time": {
                        caption: "Last Scanned",
                        icon: "al al-scan",
                        format: "date",
                        show: true,
                        transform: function (value, assetParam, key) {
                            return value * 1000;
                        },
                        types: ['host'],
                        absent: "Never"
                    },
                    "create_time": {
                        caption: "Create Time",
                        icon: "fa fa-clock-o",
                        format: "date",
                        show: true
                    },
                    "created_on": {
                        caption: "Created on",
                        icon: "fa fa-calendar",
                        format: "date",
                        show: true
                    },
                    "modified_on": {
                        caption: "Modified on",
                        icon: "fa fa-calendar",
                        format: "date",
                        show: true
                    },
                    "deployment_id": {
                        caption: "Deployment",
                        icon: 'fa fa-info-circle',
                        format: null,
                        show: true
                    }
                };

                for (const property in assetDetailsInfo) {
                    if (assetDetailsInfo.hasOwnProperty(property)) {
                        const assetDetail = assetDetailsInfo[property];
                        if (!assetDetail.show) {
                            //  This detail is disabled
                            continue;
                        }
                        if (assetDetail.types !== undefined && assetDetail.types.indexOf(asset.type) < 0) {
                            //  This detail is not supported for this asset type
                            continue;
                        }
                        if (asset.hasOwnProperty(property) && asset[property] !== "") {
                            let propertyValue = asset[property];
                            if (typeof (assetDetail.transform) === 'function') {
                                propertyValue = assetDetail.transform(propertyValue, asset, property);
                            }
                            assetDetails.push(Object.assign({ value: propertyValue }, assetDetail));
                        } else if (assetDetail.absent) {
                            assetDetails.push(Object.assign({ value: assetDetail.absent }, assetDetail));
                        } else {
                            // The content of the property is empty
                            continue;
                        }
                    }
                }
                return assetDetails;
            },
            caption: "Asset"
        },

        "acl": {
            type: "acl",
            topological: false,
            caption: "Access Control List"
        },

        "application": {
            type: 'application',
            topological: false,
            caption: "Application"
        },

        /*  Application Set */
        "application-set": {
            type: "application-set",
            topological: false,
            caption: "Application Set",
            getSetName: function (groupData) {
                if (groupData.hasOwnProperty('name')) {
                    return groupData.name.replace(',', '');
                }
                return '';
            },
            renderDescription: function (groupData) {
                return groupData.key;
            },
            renderID: function (groupData) {
                if (groupData.set_id) {
                    return groupData.set_id;
                }
                return AssetTypeDictionary.keyToID(groupData.key);
            }
        },

        "auto-scaling-group": {
            type: "auto-scaling-group",
            topological: false,
            caption: "Auto Scaling Group"
        },

        /*  DB Instance - a variant of host that is unscannable */
        "db-instance": {
            type: "db-instance",
            topological: true,
            caption: "DB Instance",
            icon: 'al aws-db-instance',
            iconMt: '',
            renderName: function (asset) {
                if (asset && asset.hasOwnProperty("name")) {
                    if (asset.instance_id) {
                        return asset.name + ": " + asset.instance_id;
                    }
                    return asset.name;
                }
                return asset.key;
            }
        },

        "disposition": {
            type: "disposition",
            topological: true,
            caption: "Disposition"
        },

        /*  Host */
        "host": {
            type: "host",
            topological: true,
            caption: "Host",
            icon: 'al al-host',
            iconMt: '',
            renderName: function (asset) {
                if (asset && asset.hasOwnProperty("name")) {
                    if (asset.instance_id) {
                        return asset.name + ": " + asset.instance_id;
                    }
                    return asset.name;
                }
                return asset.key;
            }
        },

        /* Container */
        "container": {
            type: "container",
            topological: true,
            caption: "Container",
            icon: 'material-icons',
            iconMt: 'widgets'
        },

        "host-stopped": {
            type: "host-stopped",
            topological: true,
            caption: "Host Stopped",
            renderName: function (asset) {
                if (asset && asset.hasOwnProperty("name")) {
                    if (asset.instance_id) {
                        return asset.name + ": " + asset.instance_id;
                    }
                    return asset.name;
                }
                return asset.key;
            },
            debbug: true
        },

        "host-scan-in-progress": {
            type: "host-scan-in-progress",
            caption: "Host",
            topological: true,
            renderName: function (asset) {
                if (asset && asset.hasOwnProperty("name")) {
                    if (asset.instance_id) {
                        return asset.name + ": " + asset.instance_id;
                    }
                    return asset.name;
                }
                return asset.key;
            }
        },

        "host-not-scanned": {
            type: "host-not-scanned",
            caption: "Host",
            topological: true,
            renderName: function (asset) {
                if (asset && asset.hasOwnProperty("name")) {
                    if (asset.instance_id) {
                        return asset.name + ": " + asset.instance_id;
                    }
                    return asset.name;
                }
                return asset.key;
            }
        },

        "image": {
            type: "image",
            topological: false,
            caption: "Amazon Machine Image",
            icon: 'al al-image',
            iconMt: ''
        },

        "launch-config": {
            type: "launch-config",
            topological: false,
            caption: "Launch Configuration"
        },

        "load-balancer": {
            type: "load-balancer",
            topological: false,
            caption: "Load Balancer",
            icon: 'al al-aws-elb',
            iconMt: ''
        },

        "network-interface": {
            type: "network-interface",
            topological: false,
            caption: "Network Interface"
        },

        /*  Region */
        "region": {
            type: "region",
            topological: true,
            caption: "Region",
            icon: 'al al-region',
            iconMt: '',
            renderName: function (asset): string {
                if (asset && asset.hasOwnProperty("name") && asset.name !== asset.key) {
                    if (asset.name in REGION_DICTIONARY) {
                        return REGION_DICTIONARY[asset.name];
                    }
                    return asset.name;
                } else if (asset.scope_aws_region_name) {
                    return "Region " + asset.scope_aws_region_name;
                } else {
                    return asset.key;
                }
            }
        },

        /*  Security Group */
        "sg": {
            type: "sg",
            topological: false,
            caption: "Security Group",
            pluralCaption: "Security Groups",
            icon: 'al al-sg',
            iconMt: '',
            getSetName: function (groupData) {
                if (groupData.hasOwnProperty('name')) {
                    return groupData.name;
                }
                return '';
            },
            renderDescription: function (groupData) {
                if (groupData.scope_aws_group_description) {
                    return groupData.scope_aws_group_description;       //  use the security group description if it's available
                }
                return "Key: " + groupData.key;
            },
            renderID: function (groupData) {
                return AssetTypeDictionary.keyToID(groupData.key);
            }
        },

        /*  Subnet */
        "subnet": {
            type: "subnet",
            topological: true,
            caption: "Subnet",
            renderName: function (asset) {
                if (asset && asset.hasOwnProperty("name")) {
                    if (asset.subnet_id) {
                        return asset.name + ": " + asset.subnet_id;
                    }
                    return asset.name;
                }
                if (asset.cidr_block) {
                    return "Subnet " + asset.cidr_block;
                }
                return asset.key;
            }
        },

        /*  Tag */
        "tag": {
            type: "tag",
            topological: false,
            caption: "Tag",
            getSetName: function (groupData) {
                if (groupData.scope_aws_key && groupData.scope_aws_value) {
                    return groupData.scope_aws_key + '=>' + groupData.scope_aws_value;
                }
                return groupData.key;
            },
            renderDescription: function (groupData) {
                return 'AWS Tag(s)';
            },
            renderID: function (groupData) {
                return AssetTypeDictionary.keyToID(groupData.key);
            }
        },

        /*  Virtual Private Cloud */
        "vpc": {
            type: "vpc",
            topological: true,
            caption: "Virtual Private Cloud",
            renderName: function (asset) {
                if (asset && asset.hasOwnProperty("name")) {
                    if (asset.vpc_id) {
                        return asset.name + ": " + asset.vpc_id;
                    }
                    return asset.name;
                }
                return asset.key;
            }
        },

        /*  Vulnerability Instance */
        "vulnerability": {
            type: "vulnerability",
            topological: true,
            caption: "Vulnerability",
            renderName: function (asset) {
                if (asset && asset.name !== asset.key) {
                    return asset.name;
                }
                return "Vulnerability: " + asset.scope_scan_description;
            }
        },

        /*  Vulnerability Set */
        "vulnerability-set": {
            type: "vulnerability-set",
            topological: false,
            caption: "Vulnerability Set",
            getSetName: function (groupData) {
                if (groupData.hasOwnProperty('name')) {
                    return groupData.name.replace(',', '');
                }
                if (groupData.hasOwnProperty('deployment_id')) {
                    return groupData.deployment_id + ' ' + groupData.native_type;
                }
                return groupData.environment_id + ' ' + groupData.native_type;
            },
            renderDescription: function (groupData) {
                return "Key:" + groupData.key;
            },
            renderID: function (groupData) {
                if (groupData.set_id !== undefined) {
                    return groupData.set_id;
                }
                return AssetTypeDictionary.keyToID(groupData.key);
            }
        },

        "zone": {
            type: "zone",
            topological: false,
            caption: "Zone"
        },

        /* Role */
        'role': {
            type: "role",
            topological: false,
            caption: "Role",
            pluralCaption: "Roles",
            icon: 'material-icons',
            iconMt: 'person'
        },

        /* User */
        'user': {
            type: "zone",
            topological: false,
            caption: "User",
            pluralCaption: "Users",
            icon: 'material-icons',
            iconMt: 'person'
        },

        /* Policy */
        'policy': {
            type: "policy",
            topological: false,
            caption: "Policy",
            pluralCaption: "Policies",
            icon: 'material-icons',
            iconMt: 'description'
        },

        /* Group */
        'group': {
            type: "group",
            topological: false,
            caption: "Group",
            pluralCaption: "Groups",
            icon: 'material-icons',
            iconMt: 'people'
        },

        /* Data Service */
        'data-service': {
            type: "data-service",
            topological: false,
            caption: "Service",
            pluralCaption: "Service",
            icon: 'al al-asset',
            iconMt: ''
        },

        "deployment": {
            type: "deployment",
            topological: false,
            caption: "Deployment",
            icon: 'material-icons',
            iconMt: 'language'
        },

        "s3-bucket": {
            type: "s3-bucket",
            topological: false,
            caption: "S3 bucket",
            icon: 'al al-aws-s3',
            iconMt: ''
        },

        "dns-zone": {
            type: "dns-zone",
            topological: false,
            caption: "DNS zone",
            icon: 'al al-dns',
            iconMt: ''
        },

        "volume": {
            type: "dns-zone",
            topological: false,
            caption: "Volume",
            icon: 'al aws-ebs',
            iconMt: ''
        },

        "redshift-cluster": {
            type: "redshift-cluster",
            topological: false,
            caption: "Redshift Cluster",
            icon: 'al aws-redshift-cluster',
            iconMt: ''
        },

        "cloud-trail": {
            type: "cloud-trail",
            topological: false,
            caption: "CloudTrail",
            icon: 'al al-cloudtrails',
            iconMt: ''
        },

        "external-dns-name": {
            type: "external-dns-name",
            topological: false,
            caption: "External DNS",
            icon: 'material-icons',
            iconMt: 'dns'
        },

        "external-ip": {
            type: "external-ip",
            topological: false,
            caption: "External IP",
            icon: 'material-icons',
            iconMt: 'pin_drop'
        },
    };

    /**
     *  @method assetTypeDictionary.getType
     */
    public static getType(assetType: string): IAssetType {
        return this.types.hasOwnProperty(assetType) ? this.types[assetType] : this.types['_default'];
    }

    public static keyToID = (key: string) => {
        return key.replace(/[^a-zA-Z0-9_]/g, '.');
    }

}

