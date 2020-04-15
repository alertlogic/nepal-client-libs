import { AlDefaultClient } from '@al/core';
import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { AlIngestClientInstance } from '../src/index';

let ingestClient:AlIngestClientInstance;

beforeEach(() => {
    AlDefaultClient.setGlobalParameters( { noEndpointsResolution: true } );
    ingestClient = new AlIngestClientInstance();
} );

afterEach(() => {
    sinon.restore();
});

describe('AlIngestClientInstance', () => {
    describe('When creating a notification-only correlation rule', () => {
        it('should instantiate', async () => {
            expect( ingestClient ).not.to.equal( null );
        });
    });
});
