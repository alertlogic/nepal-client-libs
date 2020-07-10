/**
 *  A container for various subscription and entitlement types.
 *      AlEntitlementRecord describes a single entitlement exposed in the subscription API's entitlement endpoint.
 *      AlEntitlementCollection is a manager for a group of entitlement records.
 *
 *  @author McNielsen <knielsen@alertlogic.com>
 *  @copyright Alert Logic, Inc 2019
 */

/**
 *  AlEntitlementRecord describes the basic properties of an entitlement.
 *  This may not represent the complete entitlement record, but excluded fields are generally not of interest outside of very specific use cases.
 */
/* tslint:disable:variable-name*/
export interface AlEntitlementRecord
{
    productId:string;
    active:boolean;
    expires:Date;
    value_type?:string;
    value?:number;
}

/**
 *  AlEntitlementCollection manages groups of entitlement records, and makes it easy (and safe) to interrogate them.
 */
export class AlEntitlementCollection
{
    /**
     * This static list of "known" entitlements is derived from actually interrogating production entitlements for all
     * active accounts.  It will need to be updated with new entitlements periodically to prevent unnecessary warning messages.
     */
    public static KnownEntitlements = [
        "Log Retention",
        "Setup Fee",
        "Shipping & Handling",
        "TM & LM Bundle",
        "Web Security Manager",
        "active_watch",
        "active_watch_premier",
        "al_internal_user",
        "assess",
        "beta_navigation",
        "cloud_defender",
        "cloud_insight",
        "detect",
        "endpoints_enabled",
        "exposures_enabled",
        "herald_v2",
        "legacy:azure_enabled",
        "legacy:cnc_host_reverse_lookup",
        "legacy:collect/log_review/aq",
        "legacy:collect/reports/cloudtrail",
        "legacy:collect/reports/wsm",
        "legacy:customer_facing_incidents",
        "legacy:dunkirk/available",
        "legacy:external_scan",
        "legacy:incidents/security/ids",
        "legacy:incidents/security/log",
        "legacy:incidents/security/pwaf",
        "legacy:incidents_beta",
        "legacy:internal_scan",
        "legacy:iris_notifications",
        "legacy:legacy_management",
        "legacy:ng_branding",
        "legacy:ngtm_enabled",
        "legacy:notification_system",
        "legacy:pci_scan",
        "legacy:pwaf_enabled",
        "legacy:restrict_hierarchy",
        "legacy:s3_enabled",
        "legacy:scan-dispute/v2",
        "legacy:ssl_decryptor",
        "legacy:suppress/security/ids",
        "legacy:suppress/security/log",
        "lmpro",
        "log_data_retention",
        "log_manager",
        "log_review",
        "managed_waf",
        "new_log_search",
        "phoenix_migrated",
        "respond",
        "response",
        "scan_watch",
        "siemless_log",
        "threat_manager",
        "tmpro",
        "web_application_firewall",
        "web_security_managed",
        "web_security_manager"
    ];
    protected collection:{[productId:string]:AlEntitlementRecord} = {};
    protected evaluationCache:{[expression:string]:boolean} = {};

    constructor( entitlements?:AlEntitlementRecord[] ) {
        if ( entitlements ) {
            this.merge( entitlements );
        }
    }

    /**
     * Static method to import an AlEntitlementCollection from a raw API response.
     */
    public static import( rawData:any, internalUser:boolean = false ):AlEntitlementCollection {
        if ( ! rawData.hasOwnProperty( "entitlements" ) || typeof( rawData.entitlements ) !== 'object' ) {
            throw new Error("Invalid usage: AlEntitlementCollection should be called with a raw entitlement descriptor." );
        }
        let records = [];
        for ( let i = 0; i < rawData.entitlements.length; i++ ) {
            let entitlement = rawData.entitlements[i];
            if ( ! entitlement.hasOwnProperty( "product_family" ) || ! entitlement.hasOwnProperty( "status" ) ) {
                console.warn("Unexpected API result: entitlements data is missing `product_family` or `status` properties." );
                continue;
            }
            let endDate = entitlement.hasOwnProperty( "end_date" ) ? new Date( entitlement.end_date * 1000 ) : new Date(8640000000000000);
            records.push( {
                productId: entitlement.product_family,
                active: ( entitlement.status === 'active' || entitlement.status === 'pending_activation' ) ? true : false,
                expires: endDate,
                value_type: entitlement.value_type || null,
                value: entitlement.value || 0
            } );
        }
        if ( rawData.hasOwnProperty( "legacy_features" ) ) {
            for ( let i = 0; i < rawData.legacy_features.length; i++ ) {
                records.push( {
                    productId: `legacy:${rawData.legacy_features[i]}`,
                    active: true,
                    expires: new Date(8640000000000000)
                } );
            }
        }
        if ( ( rawData.hasOwnProperty( "account_id" ) && rawData.account_id === '2' ) || internalUser ) {
            //  We need a pseudo entitlement to indicate this user is an internal Alert Logic user.
            records.push( {
                productId: "al_internal_user",
                active: true,
                expires: new Date(8640000000000000)
            } );
        }
        return new AlEntitlementCollection( records );
    }

    /**
     * Convenience method to generate a working collection from a simple list of productIds/entitlement keys.
     */
    public static fromArray( entitlementKeys:string[] ):AlEntitlementCollection {
        return AlEntitlementCollection.import( entitlementKeys.map( entitlementKey => {
            return {
                productId: entitlementKey,
                active: true,
                expires: new Date( Date.now() + 86400000 ),
                value: 0
            };
        } ) );
    }

    /**
     *  Merges a set of entitlement records into the collection, using the following rules:
     *      -   Active entitlements for a given product supersede inactive entitlements
     *      -   Latest active expiration supercedes earlier expirations
     */
    public merge( entitlements:AlEntitlementRecord[] ) {
        this.evaluationCache = {};      //  flush cached evaluation outputs if the entitlement set changes
        for ( let i = 0; i < entitlements.length; i++ ) {
            let entitlement = entitlements[i];
            if ( this.collection.hasOwnProperty( entitlement.productId ) ) {
                if ( entitlement.active ) {
                    if ( entitlement.expires >= this.collection[entitlement.productId].expires ) {
                        this.collection[entitlement.productId] = entitlement;
                    }
                } else {
                    if ( entitlement.expires >= this.collection[entitlement.productId].expires ) {
                        delete this.collection[entitlement.productId];
                    }
                }
            } else {
                this.collection[entitlement.productId] = entitlement;
            }
        }
        return this;
    }

    /**
     *  This accessor GUARANTEES a record, even if there isn't a matching record in the collection.
     */
    public getProduct( productId:string ):AlEntitlementRecord {
        if ( this.collection.hasOwnProperty( productId ) ) {
            return this.collection[productId];
        }
        if ( ! AlEntitlementCollection.KnownEntitlements.includes( productId ) ) {
            console.warn(`Warning: reference to unrecognized entitlement '${productId}' may indicate an erroneous entitlement condition.` );
        }
        return {
            productId: productId,
            active: false,
            expires: new Date(-8640000000000000)
        };
    }

    /**
     * Evaluates a logic expression about entitlements, returning true if the entitlements match the expression or false otherwise.
     *
     *  @param {string} entitlementExpression should be a string that expresses a specific combination of product families
     *                  with a | separated list of product families (see subscriptions service API documentation for available
     *                  product families).
     *  @returns {boolean} Indicating whether ANY of the product families in the entitlement expression
     *                  are active.
     *
     *  Example entitlement expressions:
     *
     *      threat_manager&log_manager&!cloud_insight                       <-- TM and LM and NOT Cloud Insight
     *      cloud_insight&!cloud_defender|threat_manager|log_manager        <-- Cloud Insight && NOT ( Cloud Defender | Log Manager | Threat Manager )
     */
    public evaluateExpression( entitlementExpression:string ):boolean {
        if ( ! this.evaluationCache.hasOwnProperty( entitlementExpression ) ) {
            let groups = entitlementExpression.split("&");
            let result:boolean = true;

            for ( let g = 0; g < groups.length; g++ ) {
                let groupExpression = groups[g];
                let negatedGroup = false;
                if ( groupExpression[0] === '!' ) {
                    negatedGroup = true;
                    groupExpression = groupExpression.substring( 1 );
                }

                let productIds = groupExpression.split("|");
                let entitlement = null;
                for ( let p = 0; p < productIds.length; p++ ) {
                    let productId = productIds[p];
                    let item = this.getProduct( productId );
                    if ( item.active ) {
                        entitlement = item;
                        break;
                    }
                }

                if ( negatedGroup ) {
                    entitlement = ! entitlement;
                }

                if ( ! entitlement ) {
                    result = false;
                    break;  //  no need to process further if we know this expression evaluates to false
                }
            }

            this.evaluationCache[entitlementExpression] = result;
        }
        return this.evaluationCache[entitlementExpression];
    }

    /**
     * Returns an array of all of the entitlement keys that are active in the managed collection.
     */
    public getActiveEntitlementKeys():string[] {
        return Object.keys( this.collection ).filter( entitlementKey => this.collection[entitlementKey].active );
    }

    /**
     * Implements ALConditionalSubject.getPropertyValue, allowing entitlement collections to be tested using standardized queries.
     * Namespace is assumed to be managed by a parent object, and is ignored.
     *
     * The special property `$` refers to the entire collection of *active* entitlements, as strings.
     */
    public getPropertyValue( property:string, ns:string ):any {
        if ( property === '$' ) {
            return this.getActiveEntitlementKeys();
        } else {
            let parts = property.split(".");
            let value = this.getProduct( parts[0] );
            if ( parts.length === 1 ) {
                return value.active;
            } else {
                return value.hasOwnProperty( parts[1] ) ? value.hasOwnProperty( parts[1] ) : null;
            }
        }
    }
}
