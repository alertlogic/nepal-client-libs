
export interface AlIntergationDictionary {
    singular: string;
    plural:string;
}
export class AlHeraldIntegrationDictionary {
    public static types: { [type: string]: AlIntergationDictionary } = {
        webhook:{
            singular: 'Webhook',
            plural: 'Webhooks'
        },
        email:{
            singular:'Email Ticketing',
            plural:'Email Ticketing'
        },
        jira:{
            singular:'Jira Ticketing Integration',
            plural:'Jira Ticketing Integrations'
        },
        default:{
            singular:'Integration',
            plural:'Integrations'
        }
    };

    public static getType(integrationType: string): AlIntergationDictionary {
        return this.types.hasOwnProperty(integrationType) ? this.types[integrationType] : this.types['default'];
    }
}
