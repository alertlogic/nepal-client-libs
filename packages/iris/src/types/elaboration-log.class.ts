import { Elaboration } from './elaboration.class';
/* tslint:disable:variable-name prefer-array-literal */
export class ElaborationLog extends Elaboration {

    public message:string = "";
    public messageId:string = "";
    public messageCategory:string;
    public sourceType:string; // source_type TODO por ahora source_id
    public sourceHostIp:string = "";
    public sourceName:string = "";
    public rulename:string = "";
    public host_id:string = "";

    public tokens_ParsedMessage:{[i:string]:unknown} = {};

    public tokens_LogSources:{[i:string]:unknown} = {};

    constructor() {
        super();
    }

    public static proccessTokens(tokens:any): any[] {
        const tokenFilter = [];

        for (let i = 0; i < tokens.length; i++) {

            const token = tokens[i];

            if (token.value === null) {
                continue;
            }

            if (token.value instanceof Array) {
                token.valueType = "array";
            } else {
                token.valueType = "string";
            }

            tokenFilter.push(token);
        }

        return tokenFilter;
    }

    public static deserialize(raw: any): ElaborationLog {
        const elaboration = new ElaborationLog();

        if (raw.hasOwnProperty('message')) {
            elaboration.message = raw.message;
        }

        if (raw.hasOwnProperty('messageId')) {
            elaboration.messageId = raw.messageId;
        }

        if (raw.hasOwnProperty('__messageId')) {
            elaboration.messageId = raw.__messageId;
        }

        if (raw.hasOwnProperty('category_name')) {
            elaboration.messageCategory = raw.category_name;
        }


        if (raw.hasOwnProperty('__tokens')) {
            if (raw.__tokens !== "unavailable") {

                elaboration.tokens_ParsedMessage =
                    Object.fromEntries(Object.entries(raw.__tokens.parsed_message).map(([key, value])=>{
                       key = raw.__tokens.message_fields[key] || key;
                       return [key,value];
                    }));

                if (!raw.__tokens.log_sources || typeof raw.__tokens.log_sources !== 'object') {
                    elaboration.tokens_LogSources = {};
                } else {

                    const logSourceKeyMap = {
                        "host.os_type":              "OS Type",
                        "host.os_details":           "OS Details",
                        "host.public_hostname":      "Public Hostname",
                        "host.local_hostname":       "Local Hostname",
                        "host.public_ipv4":          "Public IPv4",
                        "host.local_ipv4":           "Local IPv4",
                        "host.ec2_instance_id":      "Instance ID",
                        "host.ec2_instance_type":    "Instance Type",
                        "host.ec2_ami_id":           "Machine ID",
                        // "Auto-Scaling", this data is missing in the backend
                        "host.ec2_availability_zone":"Hosting Availability Zone",
                        "host.ec2_account_id":       "AWS Account ID",
                    };

                    elaboration.tokens_LogSources = Object.entries(logSourceKeyMap)
                        .filter(([key]) => key in raw.__tokens.log_sources)
                        .reduce(
                            (buildObj, [key, value]) => {
                                buildObj[value] = raw.__tokens.log_sources[key];
                                return buildObj;
                            },
                            {},
                        );


                }

            }
        }

        if (raw.hasOwnProperty('__sourceName')) {
            elaboration.sourceName = raw.__sourceName;
        }

        elaboration.program = (raw.program === undefined || raw.program === null) ? "No Data Available" : raw.program;

        if (raw.hasOwnProperty('__host_id')) {
            elaboration.host_id = raw.__host_id;
        }

        if (raw.hasOwnProperty('__host_name')) {
            elaboration.host_name = raw.__host_name;
        }

        if (raw.hasOwnProperty('__source_host_ip')) {
            elaboration.sourceHostIp = raw.__source_host_ip;
        }

        if (raw.hasOwnProperty('__sourceType')) {
            elaboration.sourceType = raw.__sourceType;
        }

        return elaboration;
    }
}
