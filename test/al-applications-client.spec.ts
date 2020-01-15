import { AlApplicationsClient } from '../src/index';
import { ALClient } from '@al/client';
import { expect } from 'chai';
import { describe, before } from 'mocha';
import * as sinon from 'sinon';

beforeEach(() => {
    ALClient.setGlobalParameters( { noEndpointsResolution: true } );
} );

afterEach(() => {
    sinon.restore();
});

describe('AlApplicationsClient', () => {
    it("should do something", () => {
        expect( true ).to.equal( true );
    } );
} );
