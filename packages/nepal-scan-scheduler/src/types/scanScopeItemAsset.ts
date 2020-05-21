import { ScanScopeItem } from './scanScopeItem';

export interface ScanScopeItemAsset extends ScanScopeItem {
    /**
     * Specifies the type of the asset added to the scan scope.
     * Following asset types are supported:
     * - `deployment`
     * - `region`
     * - `network`
     * - `vpc` (alias of the `network` type)
     * - `subnet`
     * - `host`
     */
    asset_type?: ScanScopeItemAsset.AssetTypeEnum;
    key: string;
    type: ScanScopeItemAsset.TypeEnum;
}
export namespace ScanScopeItemAsset {
    export type AssetTypeEnum = 'deployment' | 'region' | 'network' | 'vpc' | 'subnet' | 'host';
    export const assetTypeEnum = {
        Deployment: 'deployment' as AssetTypeEnum,
        Region: 'region' as AssetTypeEnum,
        Network: 'network' as AssetTypeEnum,
        Vpc: 'vpc' as AssetTypeEnum,
        Subnet: 'subnet' as AssetTypeEnum,
        Host: 'host' as AssetTypeEnum
    };
    export type TypeEnum = 'asset';
    export const typeEnum = {
        Asset: 'asset' as TypeEnum
    };
}
