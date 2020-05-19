import { ScanScopeItem } from './scanScopeItem';

export interface ScanScopeItemAsset extends ScanScopeItem {
    key: string;
    type: ScanScopeItemAsset.TypeEnum;
}
export namespace ScanScopeItemAsset {
    export type TypeEnum = 'asset';
    export const typeEnum = {
        Asset: 'asset' as TypeEnum
    };
}
