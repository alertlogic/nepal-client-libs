/**
 * Describes a timezone that can be used in `ScanWindow` object.
 */
export interface AlTimeZone {
    /**
     * Should be used in `ScanWindow.timezone` field.
     */
    tz_name?: string;
    status?: AlTimeZone.StatusEnum;
    utc_offset?: string;
    dst_offset?: string;
    /**
     * Optional field, for informational purposes and applicable only for timezones with `Alias` status.
     */
    tz_link?: string;
    /**
     * boolean describing whether or not the timezone is currently in daylight saving time
     */
    dst: boolean;
}
export namespace AlTimeZone {
    export type StatusEnum = 'Canonical' | 'Alias';
    export const statusEnum = {
        Canonical: 'Canonical' as StatusEnum,
        Alias: 'Alias' as StatusEnum
    };
}
