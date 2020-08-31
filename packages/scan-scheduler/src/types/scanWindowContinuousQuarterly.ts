import { AlScanWindow } from './scanWindow';

export interface AlScanWindowContinuousQuarterly extends AlScanWindow {
    type: AlScanWindowContinuousQuarterly.TypeEnum;
    /**
     * Day of month when continuous scanning window commences (`1 - 31`).
     * If selected day is not applicable to the month, the nearest date will be used instead.
     * E.g. a scan set to run on the \"30th\" will run February 28th. For API consumer's convenience `31`
     * will ALWAYS be considered as the END_OF_MONTH wildcard.
     */
    start_day: number;
    /**
     * Time of day when specific date scanning window commences (24h format, `HH:MM`)
     */
    start_time: string;
    /**
     * Day of month when continuous scanning window ends (`1 - 31`) If selected day is not applicable to the month,
     * the nearest date will be used instead. E.g. a scan set to run on the \"30th\" will run February 28th.
     * For API consumer's convenience `31` will ALWAYS be considered as the END_OF_MONTH wildcard.
     */
    end_day: number;
    /**
     * Time of day when continuous scanning window ends (24h format, `HH:MM`)
     */
    end_time: string;
    /**
     * Month of the quarter when the scan should take place; The 1st, 2nd or 3rd month of each quarter.
     */
    month_of_quarter: number;
}
export namespace AlScanWindowContinuousQuarterly {
    export type TypeEnum = 'quarterly';
    export const typeEnum = {
        Quarterly: 'quarterly' as TypeEnum
    };
}
