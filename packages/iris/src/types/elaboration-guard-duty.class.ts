import { Elaboration } from './elaboration.class';

export class ElaborationGuardDuty extends Elaboration {

    public rawGuardDutyElaboration:any = null;

    constructor() {
        super();
    }

    /**
     * Return the raw data without the fields in the blacklist
     * @param raw {Object} raw data of a guard duty evidence detail
     */
    public static cleanGuardDutyRaw(raw:any):any {

        const evidence = raw;

        const blacklist = [
            "__contentType",
            "__description",
            "__messageId",
            "__normalizedTime",
            "__relatedOrAssociated",
            "__source",
            "__uuid",
        ];

        blacklist.forEach((key) => {
            if (evidence.hasOwnProperty(key)) {
                delete evidence[key];
            }
        });

        return evidence;
    }

    public static deserialize(raw:any): ElaborationGuardDuty {

        const elaboration = new ElaborationGuardDuty();

        elaboration.rawGuardDutyElaboration = ElaborationGuardDuty.cleanGuardDutyRaw(raw);

        return elaboration;

    }

}
