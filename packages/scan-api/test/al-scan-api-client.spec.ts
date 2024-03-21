import { AlDefaultClient } from '@al/core';
import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import {
    AlScanApiClient
} from '../src/index';


beforeEach(() => {
    AlDefaultClient.setGlobalParameters({ noEndpointsResolution: true });
});

afterEach(() => {
    sinon.restore();
});

// Global spy.
let stub: sinon.SinonSpy;

describe("Scan API Client", () => {
    it("SHOULD test", () => {
        expect(true).to.equal(true);
    })
})