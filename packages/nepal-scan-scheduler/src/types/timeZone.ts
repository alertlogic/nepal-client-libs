/**
 * Describes a timezone that can be used in `ScanWindow` object.
 */
export interface AlTimeZone {
    /**
     * Should be used in `ScanWindow.timezone` field.
     */
    tzName?: string;
    status?: AlTimeZone.StatusEnum;
    utcOffset?: string;
    dstOffset?: string;
    /**
     * Optional field, for informational purposes and applicable only for timezones with `Alias` status.
     */
    tzLink?: string;
}
export namespace AlTimeZone {
    export type StatusEnum = 'Canonical' | 'Alias';
    export const statusEnum = {
        Canonical: 'Canonical' as StatusEnum,
        Alias: 'Alias' as StatusEnum
    };
}
