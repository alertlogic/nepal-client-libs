/**
 * Scan Window specifies when assets within a scope of a schedule should be scanned,
 * adhering to the `scan_frequency` parameter. Depending on the `type_of_window`
 * parameter different time windows can be specified.
 */
export interface AlScanWindow {
    type?: AlScanWindow.TypeEnum;
}
export namespace AlScanWindow {
    export type TypeEnum = 'days_of_week' | 'days_of_month' | 'weekly_period' | 'monthly_period' | 'specific_date' | 'quarterly' | 'weekday_of_month';
    export const typeEnum = {
        DaysOfWeek: 'days_of_week' as TypeEnum,
        DaysOfMonth: 'days_of_month' as TypeEnum,
        WeeklyPeriod: 'weekly_period' as TypeEnum,
        MonthlyPeriod: 'monthly_period' as TypeEnum,
        SpecificDate: 'specific_date' as TypeEnum,
        Quarterly: 'quarterly' as TypeEnum,
        WeekdayOfMonth: 'weekday_of_month' as TypeEnum
    };
}
