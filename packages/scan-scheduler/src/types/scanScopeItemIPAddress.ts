import { AlScanScopeItem } from './scanScopeItem';

export interface AlScanScopeItemIPAddress extends AlScanScopeItem {
    value: string;
    type?: AlScanScopeItemIPAddress.TypeEnum;
}
export namespace AlScanScopeItemIPAddress {
    export type TypeEnum = 'ip_address';
    export const typeEnum = {
        Address: 'ip_address' as TypeEnum
    };
}
