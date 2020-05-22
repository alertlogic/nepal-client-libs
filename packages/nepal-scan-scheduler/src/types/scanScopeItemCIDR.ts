import { AlScanScopeItem } from './scanScopeItem';

export interface AlScanScopeItemCIDR extends AlScanScopeItem {
    value: string;
    type?: AlScanScopeItemCIDR.TypeEnum;
}
export namespace AlScanScopeItemCIDR {
    export type TypeEnum = 'cidr';
    export const typeEnum = {
        Cidr: 'cidr' as TypeEnum
    };
}
