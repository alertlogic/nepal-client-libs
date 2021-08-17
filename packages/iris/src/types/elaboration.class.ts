import {
    Evidence,
    EvidenceTypes,
} from './evidence.class';
import { SourceType } from './source-type.class';

export interface ParsedData {
    json:{ [s:string]:any };
    pattern_id:string;
    rule_id:string;
    rule_name:string;
}
/* tslint:disable:variable-name prefer-array-literal */
export class Elaboration extends Evidence {
    public uuid:string;
    public time:Date;
    public description:string;
    public messageId:string;
    public elaborationType:string;
    public protocol_decodes:Array<{[i: string]: any; }> = [];
    public tokens:{ log_sources?:{[i:string]:string}; parsed_message?:{[i:string]:string}; message_fields?:{[i:string]:string}; };
    public rulename:string = "";
    public sourceName:string = "";
    public host_name:string = "";
    public program:string = "";
    public host_id:string = "";
    public appliance:string;
    public sourceType:string = "";
    public message:string = "";
    public packetCount:string = "";
    public contentType:string;
    public parsed:ParsedData;

    constructor() {
        super();
    }

    /**
     *  Converts a raw JSON object to an  Elaborations
     *  We recomend validate the object before deserialize
     *  @param {Object} rawData The raw data.
     *
     *  @returns {Elaboration} The interpreted instance object.
     */
    public static deserialize(raw:any, type?:EvidenceTypes):  Elaboration {
        const elaboration = new Elaboration();
        elaboration.time = new Date(raw.__normalizedTime);
        elaboration.evidenceType = SourceType.getType(raw.__contentType);
        elaboration.elaborationType = SourceType.getType(raw.__contentType);
        elaboration.contentType = raw.__contentType;
        elaboration.uuid = raw.__uuid;

        elaboration.tokens     = raw.__tokens;
        elaboration.rulename   = raw.rulename;
        elaboration.sourceName = raw.__sourceName;
        elaboration.host_name  = raw.__host_name;
        elaboration.sourceType = raw.__sourceType;
        elaboration.parsed     = raw.parsed;
        elaboration.program    = raw.program;
        elaboration.host_id    = raw.__host_id == null ? "No Data Available" : raw.__host_id;

        elaboration.description = "No description available.";
        elaboration.appliance = null;

        if (raw.hasOwnProperty('__description') && raw.__description !== null) {
            elaboration.description = raw.__description;
        }

        if (type) {
            elaboration.evidenceType = type;
        }

        elaboration.protocol_decodes = raw.protocol_decodes;

        if (raw.hasOwnProperty('__appliance_name') && raw.__appliance_name !== null) {
            elaboration.appliance = raw.__appliance_name;
        }

        if (raw.hasOwnProperty('message')) {
            elaboration.message = raw.message;
        }
        if (raw.hasOwnProperty('__messageId')) {
            elaboration.messageId = raw.__messageId;
        }

        if (raw.hasOwnProperty('__packetCount') && raw.__packetCount !== null) {
            // Get the packet count and substract the request packet
            elaboration.packetCount = `${raw.__packetCount > 0 ? raw.__packetCount - 1 : raw.__packetCount}`;
        }

        return elaboration;
    }

    /**
     *  Validate the minimum field the elaboration should has
     *
     *  @param {Object} rawData The raw data.
     *
     *  @returns {boolean} The interpreted instance object.
     */
    public static isValid(raw:any): boolean {
        const elaboration = new Elaboration();
        if (!raw.hasOwnProperty('__normalizedTime')) {
            elaboration.errorStructure("the elaboration does not have the field the __normalizedTime", raw);
            return false;
        }

        const time = new Date(raw.__normalizedTime);
        if (!(time instanceof Date) || isNaN(time.getTime())) {
            elaboration.errorStructure("the elaboration does not have a valid the __normalizedTime", raw);
            return false;
        }

        if (!raw.hasOwnProperty('__uuid')) {
            elaboration.errorStructure("the elaboration does not have the __uuid", raw);
            return false;
        }


        return true;
    }

    /**
     *  Converts a raw JSON array object to an array of Elaborations
     *
     *  @param {Array} rawData The raw data.
     *
     *  @returns {Array} The interpreted instance object.
     */
    public static deserializeArray(rawData:any[], elaborationType?:EvidenceTypes): Array<Elaboration> {
        const elaborations = new Array<Elaboration>();
        for (let x = 0; x < rawData.length; x++) {
            if (Elaboration.isValid(rawData[x])) {
                elaborations.push(Elaboration.deserialize(rawData[x], elaborationType));
            }
        }
        return elaborations;
    }

}

