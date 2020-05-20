import { ScanScopeItem } from './scanScopeItem';

export interface ScanScopeItemCIDR extends ScanScopeItem {
    value: string;
    type?: ScanScopeItemCIDR.TypeEnum;
}
export namespace ScanScopeItemCIDR {
    export type TypeEnum = 'cidr';
    export const typeEnum = {
        Cidr: 'cidr' as TypeEnum
    };
}
