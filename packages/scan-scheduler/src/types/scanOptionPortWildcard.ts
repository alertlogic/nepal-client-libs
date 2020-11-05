import { ScanOptionPort } from './scanOptionPort';

export interface ScanOptionPortWildcard extends ScanOptionPort {
    value: ScanOptionPortWildcard.ValueEnum;
}
export namespace ScanOptionPortWildcard {
    export type ValueEnum = 'common' | '*' | 'typically_vulnerable' | 'all';
    export const ValueEnum = {
        Common: 'common' as ValueEnum,
        Star: '*' as ValueEnum,
        TypicallyVulnerable: 'typically_vulnerable' as ValueEnum,
        All: 'all' as ValueEnum
    };
}