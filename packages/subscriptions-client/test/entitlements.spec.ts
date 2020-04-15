import { AlEntitlementCollection, AlEntitlementRecord } from '../src/types';
import { expect, assert } from 'chai';
import { describe } from 'mocha';

describe( 'AlEntitlementCollection', () => {

    const rawData = {
        account_id: '2',
        entitlements: [
            {
                product_family: 'apollo',
                status: 'pending_activation'
            },
            {
                product_family: 'calliope',
                status: 'active'
            },
            {
                product_family: 'demeter',
                status: 'unknown'
            },
            {
                product_family: 'zeus',
                status: 'expired'
            },
        ]
    };

    describe( 'WHEN empty', () => {
        let entitlements = new AlEntitlementCollection( [] );

        it( "SHOULD handle lookups to products that don't exist", () => {
            let emptyProduct = entitlements.getProduct("doesntExist");
            expect( emptyProduct ).to.be.an( 'object' );
            expect( emptyProduct.active ).to.equal( false );
        } );
    } );

    describe( 'WHEN populated', () => {
        let entitlements = AlEntitlementCollection.import( rawData );

        it( 'SHOULD correctly identity CID2 users with the al_internal_user pseudoproperty', () => {
            expect( entitlements.getProduct("al_internal_user").active ).to.equal( true );
        } );

        it( "SHOULD correctly identity items with status 'pending_activation' and 'active' as active", () => {
            expect( entitlements.getProduct("apollo").active ).to.equal( true );
            expect( entitlements.getProduct("calliope").active ).to.equal( true );
        } );

        it( "SHOULD correctly identity items with other statuses as inactive", () => {
            expect( entitlements.getProduct( "zeus" ).active ).to.equal( false );
        } );
    } );

    describe( 'evaluateExpression', () => {
        let entitlements = AlEntitlementCollection.import( rawData );

        it( 'SHOULD correctly evaluate entitlement expressions', () => {

            expect( entitlements.evaluateExpression( "apollo|zeus" ) ).to.equal( true );                        //  because apollo is pending activation
            expect( entitlements.evaluateExpression( "calliope|zeus" ) ).to.equal( true );                      //  because calliope is active
            expect( entitlements.evaluateExpression( "demeter|zeus" ) ).to.equal( false );                      //  because neither demeter and zeus are not active
            expect( entitlements.evaluateExpression( "demeter|zeus|al_internal_user" ) ).to.equal( true );      //  because al_internal_user is true for account_id 2 responses

            expect( entitlements.evaluateExpression( "apollo&calliope" ) ).to.equal( true );                    //  because both apollo and calliope are active
            expect( entitlements.evaluateExpression( "apollo&demeter" ) ).to.equal( false );                    //  because both apollo and demeter are NOT active

            expect( entitlements.evaluateExpression( "demeter|apollo&!zeus" ) ).to.equal( true );               //  because even though demeter isn't active, apollo but NOT zeus evaluates to true
        } );
    } );
} );
