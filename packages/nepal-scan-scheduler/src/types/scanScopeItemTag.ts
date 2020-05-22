import { AlScanScopeItem } from './scanScopeItem';

export interface AlScanScopeItemTag extends AlScanScopeItem {
    key?: string;
    value?: string;
    type?: AlScanScopeItemTag.TypeEnum;
}
export namespace AlScanScopeItemTag {
    export type TypeEnum = 'tag';
    export const typeEnum = {
        Tag: 'tag' as TypeEnum
    };
}
