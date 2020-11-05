export interface ScanOptionPort {
    /**
     * The required `proto` parameter allows to specify a protocol that will be used during scan for the ports selection.
     * Supported options are:   - u: UDP protocol   - t: TCP protocol   - tu: both TCP & UDP protocols
     */
    proto?: ScanOptionPort.protoEnum;
}
export namespace ScanOptionPort {
    export type protoEnum = 't' | 'u' | 'tu';
    export const protoEnum = {
        T: 't' as protoEnum,
        U: 'u' as protoEnum,
        Tu: 'tu' as protoEnum
    };
}
