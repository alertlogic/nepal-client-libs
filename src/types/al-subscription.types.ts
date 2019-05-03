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
 */
/* tslint:disable:variable-name*/
export class AlEntitlementRecord
{
    public productId:string;
    public active:boolean           =   true;
    public expires:Date             =   null;
    public value_type:string        =   null;
    public value:number             =   0;

    //  I know, my constructors are so damn old-fashioned :'(
    constructor( productId:string, active:boolean = true, expires:Date = null, rawData:any = {} ) {
        this.productId = productId;
        this.active = active;
        this.expires = expires;
        if ( rawData.value_type ) {
            this.value_type = rawData.value_type;
        }
        if ( rawData.value ) {
            this.value = rawData.value;
        }
    }

}

/**
 *  AlEntitlementCollection manages groups of entitlement records, and makes it easy (and safe) to interrogate them.
 */
export class AlEntitlementCollection
{
    protected collection:{[productId:string]:AlEntitlementRecord} = {};

    constructor( entitlements:AlEntitlementRecord[] = null ) {
        if ( entitlements ) {
            this.merge( entitlements );
        }
    }

    public static import( rawData:any ):AlEntitlementCollection {
        let records = [];
        if ( rawData.hasOwnProperty( "entitlements" ) ) {
            for ( let i = 0; i < rawData.entitlements.length; i++ ) {
                let entitlement = rawData.entitlements[i];
                if ( ! entitlement.hasOwnProperty( "product_family" ) || ! entitlement.hasOwnProperty( "status" ) ) {
                    console.warn("Unexpected API result: entitlements data is missing `product_family` or `status` properties." );
                    continue;
                }
                let endDate = entitlement.hasOwnProperty( "end_date" ) ? new Date( entitlement.end_date * 1000 ) : null;
                records.push( new AlEntitlementRecord(  entitlement.product_family,
                                                        ( entitlement.status === 'active' || entitlement.status === 'pending_activation' ) ? true : false,
                                                        endDate,
                                                        entitlement ) );
            }
        } else {
            console.warn("Unexpected API result: entitlements data should contain an `entitlements` property, but none was found." );
            return new AlEntitlementCollection();
        }
        if ( rawData.hasOwnProperty( "legacy_features" ) ) {
            for ( let i = 0; i < rawData.legacy_features.length; i++ ) {
                records.push( new AlEntitlementRecord( "legacy:" + rawData.legacy_features[i], true ) );
            }
        }
        if ( rawData.hasOwnProperty( "account_id" ) && rawData.account_id === '2' ) {
            //  We need a pseudo entitlement to indicate this user is an internal Alert Logic user.
            records.push( new AlEntitlementRecord( "al_internal_user", true  ) );
        }
        let collection = new AlEntitlementCollection( records );
        return collection;
    }

    /**
     *  Merges a set of entitlement records into the collection, using the following rules:
     *      -   Active entitlements for a given product supersede inactive entitlements
     *      -   Latest active expiration supercedes earlier expirations
     */
    public merge( entitlements:AlEntitlementRecord[] ) {
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
        return new AlEntitlementRecord( productId, false, new Date( Date.now() - 86400000 ) );
    }

}

