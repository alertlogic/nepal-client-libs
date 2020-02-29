import { AlIngestClientInstance } from '../src/index';
import { AlLocatorService, AlLocation } from '@al/common';
import { ALClient } from '@al/client';
import { expect } from 'chai';
import { describe, before } from 'mocha';
import * as sinon from 'sinon';

let ingestClient:AlIngestClientInstance;

beforeEach(() => {
    ALClient.setGlobalParameters( { noEndpointsResolution: true } );
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
