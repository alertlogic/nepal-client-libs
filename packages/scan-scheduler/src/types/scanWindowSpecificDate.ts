
import { AlScanWindow } from './scanWindow';

/**
 * Scan window for specific date and time (e.g. 10/Jun/2020 15:20).
 */
export interface AlScanWindowSpecificDate extends AlScanWindow {
    type: AlScanWindowSpecificDate.TypeEnum;
    /**
     * Specific date (`dd.mm.yyyy` format) when scan window starts.
     */
    start_date: string;
    /**
     * Time of day when specific date scanning window commences (24h format, `HH:MM`)
     */
    start_time: string;
    /**
     * Specific date (`dd.mm.yyyy` format) when scan window ends.
     */
    end_date: string | null;
    /**
     * Time of day when continuous scanning window ends (24h format, `HH:MM`)
     */
    end_time: string | null;
}
export namespace AlScanWindowSpecificDate {
    export type TypeEnum = 'specific_date';
    export const typeEnum = {
        Date: 'specific_date' as TypeEnum
    };
}
