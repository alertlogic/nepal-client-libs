export class SourceType {
    // static sources types
    public static readonly AUDITLOG = 'Incident Audit Trail';
    public static readonly FLAGGED = 'Flagged Evidence';
    public static readonly ASSOCLOG = 'application/x-alpacket-logmsgs';
    public static readonly ASSOCEVENT = 'application/x-alpacket-snmsgs';
    public static readonly ASSOCWEBEVENT = 'application/x-alpacket-wafmsgs';
    public static readonly GUARDDUTY = 'guardduty';
    public static readonly ASSOCLOGMEG = 'application/x-alpacket-megmsgs';
    public static readonly LOGREVIEWATTACHMENT = 'Attachment';
    public static readonly LOGREVIEWATTACHMENTFLAGGED = 'FlaggedEvidence';
    public static readonly ASSOCIDS = 'application/x-alpacket-idsmsgs';


    /**
     * Return the source name according the content type
     * @param {string} Content type
     * @return {string} Source name
     */
    public static getSourceName(type:string):string {

        switch (type) {
            case "application/x-alpacket-logmsgs":
                return "Log";
            case "application/x-alpacket-wafmsgs":
                return "Log";
            case "application/x-alpacket-snmsgs":
                return "Event";
            case "application/x-alpacket-megmsgs":
                return "Log";
            case "guardduty":
                return "GuardDuty findings";
            case "application/al-lr-case-evidence":
                return "Attachments";
            case "application/x-alpacket-idsmsgs":
                    return "Event";
            default:
                console.warn("Please notify the ui team that we have a new content type", type);
                return type;
        }
    }

    /**
     * Return the evidence by content type
     * @param {string} Content type
     * @return {string} Evidence type
     */
    public static getType(type:string):string {

        switch (type) {
            case "application/x-alpacket-logmsgs":
                return "associated log";
            case "application/x-alpacket-wafmsgs":
                return "associated log";
            case "application/x-alpacket-snmsgs":
                return "associated event";
            case "application/x-alpacket-megmsgs":
                return "associated log";
            case "guardduty":
                return "guardduty";
            case "application/x-alpacket-idsmsgs":
                    return "associated event";
            default:
                console.warn("Please notify the ui team that we have a new content type", type);
                return type;
        }
    }

}
