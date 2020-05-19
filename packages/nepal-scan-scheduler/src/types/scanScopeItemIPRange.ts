import { ScanScopeItem } from './scanScopeItem';

export interface ScanScopeItemIPRange extends ScanScopeItem {
    from_ip: string;
    to_ip: string;
    type?: ScanScopeItemIPRange.TypeEnum;
}
export namespace ScanScopeItemIPRange {
    export type TypeEnum = 'ip_range';
    export const typeEnum = {
        Range: 'ip_range' as TypeEnum
    };
}
