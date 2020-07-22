import { AlScanScopeItem } from './scanScopeItem';

export interface AlScanScopeItemIPRange extends AlScanScopeItem {
    from_ip: string;
    to_ip: string;
    type?: AlScanScopeItemIPRange.TypeEnum;
}
export namespace AlScanScopeItemIPRange {
    export type TypeEnum = 'ip_range';
    export const typeEnum = {
        Range: 'ip_range' as TypeEnum
    };
}
