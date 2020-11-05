export interface ScanOptionPort {
    /**
     * The required `proto` parameter allows to specify a protocol that will be used during scan for the ports selection.
     * Supported options are:   - u: UDP protocol   - t: TCP protocol   - tu: both TCP & UDP protocols
     */
    proto?: ScanOptionPort.ProtoEnum;
}
export namespace ScanOptionPort {
    export type ProtoEnum = 't' | 'u' | 'tu';
    export const ProtoEnum = {
        T: 't' as ProtoEnum,
        U: 'u' as ProtoEnum,
        Tu: 'tu' as ProtoEnum
    };
}