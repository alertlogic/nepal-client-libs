/*
 * Abstract class for all evidence types.
 * Since there is a variety of evidence coming from different sources. this provides a standard interface for filtering and sorting.
 */

export type EvidenceTypes = 'unknown'| 'associated log' | 'associated event' | 'guardduty'| 'Flagged Evidence'| 'Incident Audit Trail';
export abstract class Evidence {
    public evidenceType:EvidenceTypes|string = "unknown";
    public time:Date = new Date(0);
    // putting the notes field on the super class, because i suspect that there will more things besides elborations that will need notes in the future...
    public notes:any;

    constructor() {}

    public errorStructure(msg:string, raw:any): void {
        console.warn(msg, raw);
    }

    /**
     * This function transform the message field in an Array of objects.
     * @param text message to be processed.
     * @returns Array of Objects instance with the message field within.
     */
    wsmSplitData(text:string):Array<{ key:string; value:string }> {

        text = `|${text.substring(text.indexOf("]") + 1)}`;
        const data:Array<{ key:string; value:string }> = [];
        const parts                                    = text.split("|$");
        parts.shift();

        for (let i = 0; i < parts.length; i++) {
            const key   = parts[i].substring(0, parts[i].indexOf("="));
            const value = parts[i].substring(parts[i].indexOf("=") + 1);
            data.push({ key, value });
        }

        return data;
    }

    /**
     * Picking up an element using a criteria search.
     * @param wsmMessageData message data transformed to Array of objects.
     * @param crieteriaSearch key to be selected.
     */
    wsmSelectData(wsmMessageData:Array<{ key:string; value:string }>,
                  crieteriaSearch:string):{ value:undefined; key:undefined } | { key:string; value:string } {
        const defaultValue = { value: undefined, key: undefined };
        if (!Array.isArray(wsmMessageData)) {
            return defaultValue;
        }
        return wsmMessageData.find((d) => d.key === crieteriaSearch) || defaultValue;
    }
}
