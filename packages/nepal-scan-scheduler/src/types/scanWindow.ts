/**
 * Scan Window specifies when assets within a scope of a schedule should be scanned,
 * adhering to the `scan_frequency` parameter. Depending on the `type_of_window`
 * parameter different time windows can be specified.
 */
export interface AlScanWindow {
    type?: AlScanWindow.TypeEnum;
    /**
     * Name of the timezone that should be used for the ScanWindow object.
     * The list of all supported timezones can be obtained with `/scheduler/v2/timezones` API.
     * Accepted values are derived from `Timezone.tz_name` field.
     * Please note Daylight Saving Time will be observed and applied automatically, depending on a specified value.
     * This field is optional with `null` value defaulting to `UTC` time zone.
     */
    timezone?: string;
}
export namespace AlScanWindow {
    export type TypeEnum = 'days_of_week' | 'days_of_month' | 'weekly_period' | 'monthly_period';
    export const typeEnum = {
        DaysOfWeek: 'days_of_week' as TypeEnum,
        DaysOfMonth: 'days_of_month' as TypeEnum,
        WeeklyPeriod: 'weekly_period' as TypeEnum,
        MonthlyPeriod: 'monthly_period' as TypeEnum
    };
}
