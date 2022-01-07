import { expect } from 'chai';
import { describe } from 'mocha';
import {
    AlConditionalSubject,
    SQXSearchQuery,
} from '@al/core';


function timestamp( defaultValue:number ):number {
    return typeof( window ) !== 'undefined' && window.hasOwnProperty("performance") ? window.performance.now() : defaultValue;
}

const testQuery1 =  {
    "and": [
        {
            "=": [
                { "source": "enabled" },
                true
            ]
        },
        {
            "!=": [
                { "source": "color" },
                "purple"
            ]
        },
        {
            "not": {
                "in": [
                    { "source": "channel" },
                    [ 1, 2, 3, 4, 5 ]
                ]
            }
        }
    ]
};

const testQuery2 = {
     "or": [
        {
            "not": {
                "contains_any": [
                    {
                        "source": "collectionA"
                    },
                    [
                        "a",
                        "b",
                        "c"
                    ]
                ]
            }
        },
        {
            "contains_all": [
                {
                    "source": "collectionB"
                },
                [
                    "x",
                    "y",
                    "z"
                ]
            ]
        }
    ]
};

class SimpleSubject implements AlConditionalSubject {

    constructor( public values:{[value:string]:any} ) {
    }

    public getPropertyValue( property:string, ns:string ):any {
        if ( ! this.values.hasOwnProperty(property) ) {
            throw new Error(`Invalid property reference: this subject does not have a "${property}" property` );
        }
        return this.values[property];
    }

    public setPropertyValue( property:string, value:any ) {
        this.values[property] = value;
    }
}

describe( 'conditional evaluation', () => {

    it( 'should calculate quickly and accurately', () => {
        let evaluator = SQXSearchQuery.fromJson( testQuery1 );
        let subjects = [
            new SimpleSubject( { "enabled": true, "color": "green", "channel": 11 } ),
            new SimpleSubject( { "enabled": false, "color": "green", "channel": 11 } ),
            new SimpleSubject( { "enabled": true, "color": "purple", "channel": 11 } ),
            new SimpleSubject( { "enabled": true, "color": "orange", "channel": 11 } ),
            new SimpleSubject( { "enabled": true, "color": "orange", "channel": 1 } ),
            new SimpleSubject( { "enabled": true, "color": "orange", "channel": 2 } ),
            new SimpleSubject( { "enabled": true, "color": "orange", "channel": 3 } ),
            new SimpleSubject( { "enabled": true, "color": "orange", "channel": 4 } ),
            new SimpleSubject( { "enabled": true, "color": "orange", "channel": 5 } ),
            new SimpleSubject( { "enabled": true, "color": "orange", "channel": 6 } ),
        ];

        let expectedResults = [
            true,
            false,
            false,
            true,
            false,
            false,
            false,
            false,
            false,
            true
        ];

        let start = timestamp( 0 );

        for ( let i = 0; i < 1000; i++ ) {
            for ( let j = 0; j < subjects.length; j++ ) {
                let result = evaluator.test( subjects[j] );
                expect( result ).to.equal( expectedResults[j] );
            }
        }

        let stop = timestamp( 1 );

        let durationPerThousand = ( stop - start ) / subjects.length;

        console.log(`Average conditional evaluations: ${durationPerThousand} ms/k` );
        expect( durationPerThousand ).to.be.below( 40 );
    } );

    it( 'should calculate contains_any and contains_all against arrays and objects as expected', () => {
        let evaluator = SQXSearchQuery.fromJson( testQuery2 );
        let subject = new SimpleSubject( { collectionA: [ "a" ], collectionB: { x: 2, y: true } } );
        let result = evaluator.test( subject );
        expect( result ).to.equal( false );
        subject.setPropertyValue( "collectionA", [ "a" ] );
        subject.setPropertyValue( "collectionB", { x: true, y: true } );
        result = evaluator.test( subject );
        expect( result ).to.equal( false );

        subject.setPropertyValue( "collectionA", [ "a", "b", "c" ] );
        subject.setPropertyValue( "collectionB", { "x": true, "y": 1, z: "truthy" } );
        result = evaluator.test( subject );
        expect( result ).to.equal( true );

        subject.setPropertyValue( "collectionB", { "x": true, "y": 1, z: null } );
        result = evaluator.test( subject );
        expect( result ).to.equal( false );
    } );
} );
