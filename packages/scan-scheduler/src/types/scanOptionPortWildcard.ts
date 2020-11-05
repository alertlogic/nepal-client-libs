import { ScanOptionPort } from './scanOptionPort';

export interface ScanOptionPortWildcard extends ScanOptionPort {
    value: ScanOptionPortWildcard.valueEnum;
}
export namespace ScanOptionPortWildcard {
    export type valueEnum = 'common' | '*' | 'typically_vulnerable' | 'all';
    export const valueEnum = {
        Common: 'common' as valueEnum,
        Star: '*' as valueEnum,
        TypicallyVulnerable: 'typically_vulnerable' as valueEnum,
        All: 'all' as valueEnum
    };
}
