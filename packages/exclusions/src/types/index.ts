
/* tslint:disable:variable-name */

export class ExclusionsRulesDescriptor {

    public id?: string;
    public name: string;
    public description: string;
    public enabled: boolean = true;
    public features: Array<string> = [];
    public blackouts: ExclusionsBlackouts[] = [];
    public assets: ExclusionsAssets[] = [];
    public details?: ExlusionsDetails[] = [];
    public modified?: ExclusionsModified[] = [] ;

    constructor() {
    }

    public static import(rawData: any): ExclusionsRulesDescriptor {

        let exclusion = new ExclusionsRulesDescriptor();

        if (rawData.hasOwnProperty('id')) {
            exclusion.id = rawData.id;
        }
        exclusion.name = rawData.hasOwnProperty('name') ? rawData.name : null;
        exclusion.description = rawData.hasOwnProperty('description') ? rawData.description : null;
        exclusion.enabled = rawData.hasOwnProperty('enabled') ? (typeof rawData.enabled === 'string') ? (rawData.enabled === 'true') ? true : false : rawData.enabled : true;

        if (rawData.hasOwnProperty('features') && Array.isArray(rawData.features)) {
            for (let i = 0; i < rawData.features.length; i++) {
                exclusion.features.push(rawData.features[i]);
            }
        }

        if (rawData.hasOwnProperty('blackouts') && Array.isArray(rawData.blackouts)) {
            for (let i = 0; i < rawData.blackouts.length; i++) {
                exclusion.blackouts.push(rawData.blackouts[i].hasOwnProperty('resolution') ? ExclusionsBlackouts.import(rawData.blackouts[i]) : new ExclusionsBlackouts());
            }
        }

        if (rawData.hasOwnProperty('assets') && Array.isArray(rawData.assets)) {
            for (let i = 0; i < rawData.assets.length; i++) {
                exclusion.assets.push(rawData.assets[i].hasOwnProperty('type') ? ExclusionsAssets.import(rawData.assets[i]) : new ExclusionsAssets());
            }
        }

        if (rawData.hasOwnProperty('details') && Array.isArray(rawData.details)) {
            for (let i = 0; i < rawData.details.length; i++) {
                exclusion.details.push(rawData.details[i].hasOwnProperty('feature') ? ExlusionsDetails.import(rawData.details[i]) : new ExlusionsDetails());
            }
        }

        if (typeof (rawData?.modified) === 'object') {
            exclusion.modified.push((rawData.modified.hasOwnProperty('at') || rawData.modified.hasOwnProperty('by')) ? ExclusionsModified.import(rawData.modified) : new ExclusionsModified());
        }

        return exclusion;
    }

    public update(rule: ExclusionsRulesDescriptor): void {
        this.id = rule.id;
        this.name = rule.name;
        this.description = rule.description;
        this.enabled = rule.enabled;
        this.features = rule.features;
        this.blackouts = rule.blackouts;
        this.assets = rule.assets;
        this.details = rule.details;
    }

}

/**
 *  TimeScheduleDescriptor provides a class to describe any schedule time, along with its
 *  raw properties and annotations.
 */
export class TimeScheduleDescriptor {

    public isCertainHoursChecked: boolean = false;
    public hourWindow: string = "12";
    public hours: string = "00";
    public minutes: string = "00";

    constructor(rawData: any) {

        if (rawData.hasOwnProperty('isCertainHoursChecked')) {
            this.isCertainHoursChecked = rawData.isCertainHoursChecked;
        }
        if (rawData.hasOwnProperty('hourWindow')) {
            this.hourWindow = rawData.hourWindow;
        }
        if (rawData.hasOwnProperty('hours')) {
            this.hours = rawData.hours;
        }
        if (rawData.hasOwnProperty('minutes')) {
            this.minutes = rawData.minutes;
        }

    }

}

export class ExclusionsBlackouts {

    resolution: BlackoutsResolution;
    day_of_week?: number[];
    day_of_month?: number[];
    date?: string;
    start_time?: string;
    end_time?: string;

    constructor() { }

    public static import(rawData: any): ExclusionsBlackouts {

        let blackout = new ExclusionsBlackouts();

        blackout.resolution = rawData.hasOwnProperty('resolution') ? rawData.resolution : "permanent";

        if (rawData.hasOwnProperty('day_of_week')) {
            blackout.day_of_week = rawData.day_of_week;
        }

        if (rawData.hasOwnProperty('day_of_month')) {
            blackout.day_of_month = rawData.day_of_month;
        }

        if (rawData.hasOwnProperty('date')) {
            blackout.date = rawData.date;
        }

        if (rawData.hasOwnProperty('start_time')) {
            blackout.start_time = rawData.start_time;
        }

        if (rawData.hasOwnProperty('end_time')) {
            blackout.end_time = rawData.end_time;
        }

        return blackout;
    }

}

export class ExclusionsAssets {

    type: AssetType;
    asset_type?: string;
    value?: string;
    key?: string;

    constructor() { }

    public static import(rawData: any): ExclusionsAssets {

        let asset = new ExclusionsAssets();

        asset.type = rawData.hasOwnProperty('type') ? rawData.type : "asset";

        if (rawData.hasOwnProperty('asset_type')) {
            asset.asset_type = rawData.asset_type;
        }

        if (rawData.hasOwnProperty('value')) {
            asset.value = rawData.value;
        }

        if (rawData.hasOwnProperty('key')) {
            asset.key = rawData.key;
        }

        return asset;
    }
}

export class ExlusionsDetails {

    feature: DetailsFeature;
    scan_type?: ScanType;
    port?: string;
    ports?: any[];
    proto?: Protocols;
    cidr?: string;

    constructor() { }

    public static import(rawData: any): ExlusionsDetails {

        let detail = new ExlusionsDetails();

        detail.feature = rawData.hasOwnProperty('feature') ? rawData.feature : "scan";

        if (rawData.hasOwnProperty('scan_type')) {
            detail.scan_type = rawData.scan_type;
        }
        if (rawData.hasOwnProperty('port')) {
            detail.port = rawData.port;
        }
        if (rawData.hasOwnProperty('proto')) {
            detail.proto = rawData.proto;
        }

        if (rawData.hasOwnProperty('ports') && Array.isArray(rawData.ports)) {
            detail.ports = [];
            for (let i = 0; i < rawData.ports.length; i++) {
                if (typeof rawData.ports[i] === 'string' || typeof rawData.ports[i] === 'number') {
                    detail.ports.push(rawData.ports[i]);
                }
            }
        }

        if (rawData.hasOwnProperty('cidr')) {
            detail.cidr = rawData.cidr;
        }

        return detail;
    }

}

export class ExclusionsModified {

    at?: number;
    by?: string;

    constructor() { }

    public static import(rawData: any): ExclusionsModified {

        let modified = new ExclusionsModified();

        if (rawData.hasOwnProperty('at')) {
            modified.at = rawData.at;
        }

        if (rawData.hasOwnProperty('by')) {
            modified.by = rawData.by;
        }

        return modified;
    }
}

export class ExclusionsRulesSnapshot {

    public rules: Array<ExclusionsRulesDescriptor> = [];
    /**
     *  @method ExclusionsRulesSnapshot.import
     *
     *  This method expects to receive the raw object response from exclusions endpoint
     *  /exclusions/v1/{accountId}/{deploymentId}/rules
     *  It returns a populated instance of type ExclusionsRulesSnapshot.
     */
    public static import(rawData: any): ExclusionsRulesSnapshot {

        let rules: ExclusionsRulesSnapshot = new ExclusionsRulesSnapshot();
        if (rawData.hasOwnProperty('rules') && Array.isArray(rawData.rules)) {
            for (let i = 0; i < rawData.rules.length; i++) {
                rules.rules.push(rawData.rules[i].hasOwnProperty('id') ? ExclusionsRulesDescriptor.import(rawData.rules[i]) : new ExclusionsRulesDescriptor());
            }
        }

        return rules;
    }

}

export class CidrType {
    public id: string;
    public protocol: string;
    public cidr: string;
    public port: string;
    public networkKey: string;
    public asset_type: string;
    public description: string;

    public static import(rawData: any): CidrType {
        let item = new CidrType();

        item.id = rawData.hasOwnProperty('id') ? rawData.id : '';
        item.protocol = rawData.hasOwnProperty('protocol') ? rawData.protocol : '';
        item.cidr = rawData.hasOwnProperty('cidr') ? rawData.cidr : '';
        item.port = rawData.hasOwnProperty('port') ? rawData.port : '';
        item.networkKey = rawData.hasOwnProperty('networkKey') ? rawData.networkKey : '';
        item.asset_type = rawData.hasOwnProperty('asset_type') ? rawData.asset_type : '';
        item.description = rawData.hasOwnProperty('description') ? rawData.description : '';

        return item;
    }
}

export class AllExclusionsToSave {
    external_scanning: Array<ExclusionsAssets>;
    internal_scanning: Array<ExclusionsAssets>;
    agent_scanning: Array<ExclusionsAssets>;
    internal_scanning_ports: { asset: ExclusionsAssets, details: ExlusionsDetails[], ruleId: string }[];
    external_scanning_ports: { asset: ExclusionsAssets, details: ExlusionsDetails[], ruleId: string }[];
    networks_ids: Array<CidrType>;
    networks_deleted: Array<string>;
    ports_rules_deleted: Array<string>;
    changes: boolean;
}

export const enum BlackoutsResolution {
    weekly = 'weekly',
    monthly = 'monthly',
    exact_date = 'exact_date',
    permanent = 'permanent'
}

export const enum AssetType {
    cidr = 'cidr',
    asset = 'asset',
    tag = 'tag'
}

export const enum DetailsFeature {
    scan = 'scan',
    ids = 'ids'
}

export const enum ScanType {
    vulnerability = 'vulnerability',
    pci = 'pci',
    discovery = 'discovery',
    external = 'external'
}

export const enum Protocols {
    tcp = 'tcp',
    udp = 'udp',
    icmp = 'icmp',
    asterisk = '*'
}
