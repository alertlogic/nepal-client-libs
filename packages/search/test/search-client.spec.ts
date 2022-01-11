import { expect } from 'chai';

import { describe } from 'mocha';
import * as sinon from 'sinon';
import {
    AlDefaultClient,
    AlRuntimeConfiguration,
    ConfigOption,
    AlLocation,
    AlLocatorService,
} from "@al/core";
import {
    AlSearchClient,
    AlSearchClientV2
} from '../src';

describe('AlSearchClient', () => {
    let requestStub;
    beforeEach(() => {
        AlLocatorService.setContext( { environment: "integration", "residency": "US" } );
        AlRuntimeConfiguration.setOption( ConfigOption.DisableEndpointsResolution, true );
        requestStub = sinon.stub( ( AlDefaultClient as any ), 'axiosRequest' ).resolves( { status: 200, statusText: "OK", data: { message: 'some data' }, headers: {}, config: {} } );
    });
    afterEach(() => {
        sinon.restore();
        AlRuntimeConfiguration.reset();
    });
    it("should form a valid request when `submitSearch()` is called", async () => {
        let response = await AlSearchClient.submitSearch( "2", "logmsgs", {} );
        let requestCall = requestStub.getCall( 0 );
        expect( requestStub.callCount ).to.equal( 1 );
        expect( requestCall.args[0].method ).to.equal( 'POST' );
        expect( requestCall.args[0].url ).to.equal( `https://api.product.dev.alertlogic.com/search/v1/2/search/logmsgs` );
    } );
    it("should form a valid request when `fetchSearchResults` is called", async () => {
        let response = await AlSearchClient.fetchSearchResults( "2", "12345678" );
        let requestCall = requestStub.getCall( 0 );
        expect( requestStub.callCount ).to.equal( 1 );
        expect( requestCall.args[0].method ).to.equal( 'GET' );
        expect( requestCall.args[0].url ).to.equal( `https://api.product.dev.alertlogic.com/search/v1/2/fetch/12345678` );
    } );
    it("should form a valid request when `fetchSearchResultsAsCSV` is called", async () => {
        let response = await AlSearchClient.fetchSearchResultsAsCSV( "2", "12345678" );
        let requestCall = requestStub.getCall( 0 );
        expect( requestStub.callCount ).to.equal( 1 );
        expect( requestCall.args[0].method ).to.equal( 'GET' );
        expect( requestCall.args[0].url ).to.equal( `https://api.product.dev.alertlogic.com/search/v1/2/fetch/12345678` );
        expect( 'Accept' in requestCall.args[0].headers ).to.equal( true );
    } );
} );
