/**
 * Element of `scan_scope` list that specifies which assets should be taken into account
 * when a given scan schedule is concerned. Please note that `ScanAsset` might be either a
 * concrete asset i.e. `deployment`, `network`, `subnet`, `host`, or can be an abstract asset
 * qualificator such as `IP` range, `CIDR` range or a `tag`.
 */
export interface ScanScopeItem {
    type?: ScanScopeItem.TypeEnum;
}
export namespace ScanScopeItem {
    export type TypeEnum = 'asset' | 'cidr' | 'ip_range' | 'tag';
    export const typeEnum = {
        Asset: 'asset' as TypeEnum,
        Cidr: 'cidr' as TypeEnum,
        IpRange: 'ip_range' as TypeEnum,
        Tag: 'tag' as TypeEnum
    };
}
