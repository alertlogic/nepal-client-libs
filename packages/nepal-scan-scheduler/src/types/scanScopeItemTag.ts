import { ScanScopeItem } from './scanScopeItem';

export interface ScanScopeItemTag extends ScanScopeItem {
    key?: string;
    value?: string;
    type?: ScanScopeItemTag.TypeEnum;
}
export namespace ScanScopeItemTag {
    export type TypeEnum = 'tag';
    export const typeEnum = {
        Tag: 'tag' as TypeEnum
    };
}
