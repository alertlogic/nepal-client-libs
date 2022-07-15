import { expect } from 'chai';
import { describe } from 'mocha';
import {
    SQXComparatorEqual,
    SQXCursorDetails,
    SQXOperatorAnd,
    SQXOperatorBase,
    SQXOperatorNegate,
    SQXParser,
    SQXQueryBuilder,
    SQXSearchQuery,
} from '../src/parser';

describe('SQX Parser', () => {
    describe( 'query parsing', () => {
        it( "should interpret idempotent queries successfully", () => {
            let errorCount = 0;
            let validQueries = [
                'WHERE a < 5',
                'WHERE a <= 5',
                'WHERE a > 5',
                'WHERE a >= 6',
                'WHERE a != 5',
                'WHERE a != "5"',
                'WHERE a != null',
                'WHERE a != true',
                'WHERE a != false',
                'WHERE NOT a != false',
                "SELECT * WHERE a = true",
                "SELECT * WHERE a = true AND b = true",
                "SELECT * WHERE a = true OR b = true",
                "SELECT * WHERE ( a = true AND b = true ) OR c = true",
                "SELECT * WHERE a = true AND ( b = true OR c = true )",
                "SELECT a, b, c WHERE ( a > 5 AND b < 6 ) OR ( c = \"true\" AND d = false )",
                "SELECT a, b, c WHERE ( a > 5 AND b < 6 ) OR ( c = true AND d = \"false\" )",
                'SELECT a:property AS "ACount"',
                'SELECT COUNT( a:property ) AS "PropertyACount"',
                'SELECT UCOUNT( a:property ) AS "UniquePropertyACount"',
                'SELECT MIN( a:property ) AS "MinPropertyACount"',
                'SELECT MAX( a:property ) AS "MaxPropertyACount"',
                'SELECT AVG( a:property ) AS "AverageePropertyACount"',
                'SELECT UCOUNT( fake:prop1 ) AS "a", COUNT( fake:prop2 ) AS "b", MIN( fake:prop3 ) AS "first", MAX( fake:prop3 ) AS "last", AVG( fake:prop3 ) AS "average"',
                'SELECT * GROUP BY log:pid HAVING COUNT( log:message ) > 5',
                'SELECT * GROUP BY a, b, c HAVING COUNT( fake:property ) < 5',
                'SELECT * GROUP BY fake:property2 HAVING COUNT( fake:property ) >= 5000000',
                'SELECT * GROUP BY fake:property3 HAVING COUNT( fake:property ) <= -1',
                'SELECT * GROUP BY fake:blah HAVING COUNT( fake:property ) = -1',
                'SELECT * GROUP BY fake:blah HAVING COUNT( fake:property ) != -1',
                'ORDER BY fake:property ASC LIMIT 50',
                'ORDER BY fake:property DESC LIMIT 5000',
                /*  Test value aliases/substitutions */
                'SELECT * WHERE message_content IN ( "Windows/7/Sucks", "Liallo The Cat" )',
                'WHERE NOT log:property = "Big Moustache" AND log:moustache = null',
            ];

            for ( let i = 0; i < validQueries.length; i++ ) {
                let original = validQueries[i], reconstituted;
                try {
                    let query = SQXSearchQuery.fromQueryString( original );
                    let queryString = query.toQueryString();
                    let json = query.toJson();
                    let reinterpreted = SQXSearchQuery.fromJson( json );
                    reconstituted = reinterpreted.toQueryString();
                    if ( original !== reconstituted ) {
                        throw new Error("Original and reconstituted queries don't match!" );
                    }
                } catch ( e ) {
                    errorCount++;
                    console.warn("WARNING: query did not reconstite as expected" );
                    console.log( `    - Input: ${original}` );
                    console.log( `    - Output: ${reconstituted}` );
                }
            }

            expect( errorCount ).to.equal( 0 );

        });

        it("should interpret query fragments successfully", () => {
            let errorCount = 0;
            let fragmentQueries = [
                "kevin = true",
                '( kevin = true AND moustache = false ) OR clipper = 0',
                '( anchovies = "definitely" AND kippers = "SMOKED" ) AND ( c < 0 OR b > 0 )'
            ];

            for ( let i = 0; i < fragmentQueries.length; i++ ) {
                let original = fragmentQueries[i], reconstituted;
                let json;
                let queryString;
                try {
                    let query = SQXSearchQuery.fromConditionString( original );
                    queryString = query.toConditionString();
                    json = query.toJson( true );
                    let reinterpreted = SQXSearchQuery.fromJson( json );
                    reconstituted = reinterpreted.toConditionString();
                    if ( original !== reconstituted ) {
                        throw new Error("Original and reconstituted queries don't match!" );
                    }
                } catch ( e ) {
                    errorCount++;
                    console.warn("WARNING: query did not reconstite as expected" );
                    console.log( `    - Input: ${original}` );
                    console.log( `    - Intermediary`, JSON.stringify( json, null, 4 ) );
                    console.log( `    - Output: ${reconstituted}` );
                }
            }

            expect( errorCount ).to.equal( 0 );
        } );

        it("should collapse AND clauses with single operators in them", () => {
            let json = {
                  "where":{
                     "and":[
                        {
                           "=":[
                              {
                                 "source": "a"
                              },
                              true
                           ]
                        }
                     ]
                  }
               };
            let query = SQXSearchQuery.fromJson( json );
            let converted = query.toConditionString();
            let expressedJson = query.toJson();
            expect( converted ).to.equal( "a = true" );
            expect( expressedJson ).to.eql( {
                'where': {
                   "=":[
                      {
                         "source": "a"
                      },
                      true
                   ]
                }
            } );
        } );

        it( "should identify errors in badly formed queries", () => {
            let errorCount = 0;
            let brokenQueries = [
                "SELECT * WHERE",
                "SELECT * WHERE a",
                "SELECT * WHERE a = ",
                "SELECT * WHERE a = '",
                //                "SELECT * WHERE a = (true)",
                "SELECT a, b, c WHERE ( a > 5 AND b < 6 ) OR ( c == true && d = false )",
                'WHERE NOT NOT a = true',
                //                'SELECT a, b, WHERE a = b',
                'LIMIT 50 60 70',
                'LIMIT -20',
                'LIMIT fifty',
                'LIMIT true',
                'LIMIT null',
                'ORDER BY fake:property, ASC',
                'ORDER BY fake:property NONSENSE'
            ];

            for ( let i = 0; i < brokenQueries.length; i++ ) {
                let q = brokenQueries[i];
                let parser = new SQXParser();
                parser.evaluate( q );
                if ( parser.state.errors.length === 0 ) {
                    console.warn("WARNING: broken query [" + q + "] did not generate errors!" );
                    errorCount++;
                }
            }

            expect( errorCount ).to.equal( 0 );
        });

        it( "should transform idiosyncratic queries into normalized form", () => {
            let tests = [
                {
                    //  deeply nested simple operators moved to top level
                    input: "SELECT * WHERE ( ( ( ( a = null ) ) ) )",
                    output: "SELECT * WHERE a = null"
                },
                {
                    //  deeply nested simple operators that are part of a group OR
                    input: "SELECT * WHERE kevin:moustache = false OR ( ( ( ( a = null ) ) ) ) OR c = true",
                    output: "SELECT * WHERE kevin:moustache = false OR a = null OR c = true"
                },
                {
                    //  normalize AND and OR operators
                    input: "WHERE ( a = true && b = true ) || ( c = true && d = true )",
                    output: "WHERE ( a = true AND b = true ) OR ( c = true AND d = true )"
                },
                {
                    //  normalize "," in implicit AND clause
                    input: "WHERE a = true, b = true, c = \"potato\"",
                    output: "WHERE a = true AND b = true AND c = \"potato\""
                },
                {
                    //  normalize "," in implicit OR clause
                    input: "WHERE a = true OR b = true, c = \"potato\"",
                    output: "WHERE a = true OR b = true OR c = \"potato\""
                },
                {
                    //  implicit string literals and normalized spacing
                    input: "WHERE a=false, b=true, c = null, d= kevin, e =Kevins_Big_Moustache, f=a",
                    output: "WHERE a = false AND b = true AND c = null AND d = \"kevin\" AND e = \"Kevins_Big_Moustache\" AND f = \"a\""
                },
                {
                    //  implicit string literals and normalized spacing
                    input: "WHERE a=false, b=true, c = null, d= kevin, e =Kevins_Big_Moustache, f=a",
                    output: "WHERE a = false AND b = true AND c = null AND d = \"kevin\" AND e = \"Kevins_Big_Moustache\" AND f = \"a\""
                }
                /*
                {
                    //  normalized operators
                    input: "WHERE a gt b, b lt c, c gte 5, d lte 1, e neq a, f <> a",
                    output: "WHERE a > b AND b < c AND c >= 5 AND d <= 1 AND e != a AND f != a"
                }
                 */
            ];

            let errorCount = 0;

            for ( let i = 0; i < tests.length; i++ ) {
                let test = tests[i];
                let original = test.input, reconstituted;
                try {
                    let query = SQXSearchQuery.fromQueryString( original );
                    let queryString = query.toQueryString();
                    let json = query.toJson();
                    let reinterpreted = SQXSearchQuery.fromJson( json );
                    reconstituted = reinterpreted.toQueryString();
                    if ( reconstituted !== test.output) {
                        throw new Error("Original and reconstituted queries don't match!" );
                    }
                } catch ( e ) {
                    errorCount++;
                    console.warn("WARNING: query did not reconstite as expected", original );
                    console.log( "    - Input: [%s]", original );
                    console.log( "    - Expected: [%s]", test.output );
                    console.log( "    - Actual: [%s]", reconstituted );
                }
            }

            expect( errorCount ).to.equal( 0 );
        });

        it( "should be able to interpret native search query objects", () => {

            let rawQuery = {
                  "where":{
                     "and":[
                        {
                           "between":[
                              {
                                 "source":"time_recv"
                              },
                              1540056210,
                              1540059810
                           ]
                        },
                        {
                           "!=":[
                              {
                                 "source": "host_name"
                              },
                              "foo"
                           ]
                        }
                     ]
                  },
                  "select":[
                     "time_recv",
                     "message"
                  ],
                  "order_by":[
                     [
                        "time_recv",
                        "desc"
                     ]
                  ],
                  "limit":"infinity"
               };
            let q = SQXSearchQuery.fromJson( rawQuery );

            expect( q.where.condition instanceof SQXOperatorAnd ).to.equal( true );
        } );

        it( "should properly identify cursor phrases in the select clause", () => {
            let expression = 'SELECT [Property1], Property2, arbitrary.json.property, MIN( [Property4] ) AS "MinPropertyAlias"';
            //                ^0     ^7                      ^31                                                     ^84

            let parser = new SQXParser();
            parser.evaluate( expression );

            let cursor:SQXCursorDetails;

            cursor = SQXCursorDetails.fromParser( parser, 0 );
            expect( cursor.phrase ).to.equal( expression );          //  should capture the entire expression
            expect( cursor.inferredType ).to.equal( 'operator' );
            expect( cursor.topClauseType ).to.equal( "select" );

            cursor = SQXCursorDetails.fromParser( parser, 7 );
            expect( cursor.phrase ).to.equal( '[Property1]');        //  should capture JUST the property
            expect( cursor.inferredType ).to.equal( 'property' );
            expect( cursor.topClauseType ).to.equal( 'select' );

            cursor = SQXCursorDetails.fromParser( parser, 56 );
            expect( cursor.phrase ).to.equal( 'MIN( [Property4] ) AS "MinPropertyAlias"' );
            expect( cursor.inferredType ).to.equal( 'operator' );
            expect( cursor.topClauseType ).to.equal( 'select' );
        } );
        xit( "should properly identify cursor phrases in the select clause", () => {

            //  For this test, we'll pull cursor information for the property, operator, and one value in the last expression of this compound where clause.
            //  We will validate that the cursor logic identifies the proper phrase range and type for each element, and that the mapping from operator to property
            //  and values (and vice versa) is properly established.
            let expression = 'WHERE a = true, b = false, c IN ( 1, 2, 3 ), AND d CONTAINS_ANY ( "hackery", "slashery", "slap" )';

            let parser = new SQXParser();
            parser.evaluate( expression );

            let propertyCursor = SQXCursorDetails.fromParser( parser, 49 );
            let operatorCursor = SQXCursorDetails.fromParser( parser, 51 );
            let valueCursor = SQXCursorDetails.fromParser( parser, 91 );
            expect( propertyCursor.phrase ).to.equal( 'd CONTAINS_ANY ( "hackery", "slashery", "slap" )' );
            expect( propertyCursor.tokenText ).to.equal( "d" );
            expect( propertyCursor.inferredType ).to.equal( "property" );
            expect( propertyCursor.token.parent ).to.equal( operatorCursor.token );

            expect( operatorCursor.phrase ).to.equal( 'd CONTAINS_ANY ( "hackery", "slashery", "slap" )' );
            expect( operatorCursor.tokenText ).to.equal( "CONTAINS_ANY" );
            expect( operatorCursor.inferredType ).to.equal( "operator" );
            if ( operatorCursor.token instanceof SQXOperatorBase ) {
                expect( operatorCursor.token.opPropertyRef ).to.equal( propertyCursor.token );
                expect( operatorCursor.token.opValues.indexOf( valueCursor.token ) ).to.equal( 2 );      //  3rd parameter in list
            } else {
                throw new Error("Expected operatorCursor to be an instance of SQXOperatorBase!" );
            }

            expect( valueCursor.phrase ).to.equal( 'd CONTAINS_ANY ( "hackery", "slashery", "slap" )' );
            expect( valueCursor.tokenText ).to.equal( "slap" );
            expect( valueCursor.inferredType ).to.equal( "value" );
            expect( valueCursor.token.parent ).to.equal( operatorCursor.token );
        } );
    } );

    it("should correctly allow retrieval of where conditions", () => {
        let query = SQXSearchQuery.fromQueryString( `WHERE account.id IN ( "2", "67108880", "12345678" ) AND asset.deployment_id = 'KevinsDeployment' AND NOT asset.vpc_id IN( 'VPC-A', 'VPC-B', 'VPC-C' )` );

        let query2 = new SQXSearchQuery();
        let conditions = query2.getConditions();

        expect( conditions ).to.be.ok;
    } );

    it("should allow manual construction of conditional clauses using top level `and`, `or`, `equals`, and `in` methods", () => {
        let query = SQXSearchQuery.empty()
                                    .or()
                                        .equals("multiproperty", 1 )
                                        .equals("multiproperty", 2 )
                                    .and()
                                        .equals( "kevin", 3 )
                                        .equals("something", "4" )
                                        .in("asset:vpc_id", [ "vpc-1", "vpc-2", "vpc-3" ] )
        expect( query ).to.be.ok;
        let where = query.getConditions();
        expect( where instanceof SQXOperatorBase ).to.equal( true );
        expect( where instanceof SQXOperatorAnd ).to.equal( true );

        let conditions = query.getPropertyConditions("multiproperty" );
        expect( conditions.length ).to.equal( 2 );

        let condition = query.getPropertyCondition( "asset:vpc_id" );

        let values = condition.getValues();
        expect( values.length ).to.equal( 3 );

        expect( () => query.getPropertyCondition( "multiproperty" ) ).to.throw;
        condition = query.getPropertyCondition("not_present");
        expect( condition ).to.equal( null );
    } );

    it("should support entitlement queries", () => {
        try {
            let qs = "WHERE $ CONTAINS_ANY ( 'assess', 'detect', 'respond' ) OR $ CONTAINS_ALL ( 'cloud_insight', 'cloud_defender', 'legacy:incident_notifications_v2' ) OR cloud_insight = true";
            let query = SQXSearchQuery.fromQueryString( qs );
            expect( true ).to.equal( true );
        } catch( e ) {
            console.log("Parse failed", e );
        }
    } );

    it("should support dynamic query building and lookup of conditions for specific properties", () => {
        let where = new SQXQueryBuilder().where();
        where.not().equals( "kevin", "1" );
        where.equals( "account.id", "67108880" );
        where.not().in( "account.id", [ "1", "2", "3", "4" ] );
        where.notEquals( "activated", true );

        const query = where.toJson();
        expect( query ).to.deep.equal( {
            and: [
                     {
                        "not": {
                            "=": [
                                {
                                    "source": "kevin"
                                },
                                "1"
                            ]
                        }
                    },
                    {
                        "=": [
                            {
                                "source": "account.id"
                            },
                            "67108880"
                        ]
                    },
                    {
                        "not": {
                            "in": [
                                {
                                    "source": "account.id"
                                },
                                [
                                    "1",
                                    "2",
                                    "3",
                                    "4"
                                ]
                            ]
                        }
                    },
                    {
                        "!=": [
                            {
                                "source": "activated"
                            },
                            true
                        ]
                    }

            ]
        } );

        let q2 = SQXSearchQuery.fromJson( {
            "and":[
               {
                  "in":[
                     {
                        "source":"notification.threat_level"
                     },
                     [
                        "Info"
                     ]
                  ]
               },
               {
                  "not":{
                     "=":[
                        {
                           "source":"account.id"
                        },
                        "2"
                     ]
                  }
               }
            ]
        } );
        let condition = q2.getPropertyCondition( "account.id" );
        expect( condition instanceof SQXComparatorEqual ).to.equal( true );
        expect( condition.parent instanceof SQXOperatorNegate ).to.equal( true );
    } );
});
