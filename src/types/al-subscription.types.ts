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
    protected collection:{[productId:string]:AlEntitlementRecord} = {};
    protected evaluationCache:{[expression:string]:boolean} = {};

    constructor( entitlements:AlEntitlementRecord[] = null ) {
        if ( entitlements ) {
            this.merge( entitlements );
        }
    }

    /**
     * Static method to import an AlEntitlementCollection from a raw API response.
     */
    public static import( rawData:any ):AlEntitlementCollection {
        let records = [];
        if ( rawData.hasOwnProperty( "entitlements" ) ) {
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
        } else {
            console.warn("Unexpected API result: entitlements data should contain an `entitlements` property, but none was found." );
            return new AlEntitlementCollection();
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
        if ( rawData.hasOwnProperty( "account_id" ) && rawData.account_id === '2' ) {
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
}
